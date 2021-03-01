const _ = require('lodash');

const maxDecay = 5000;

module.exports = function(config) {
    if(config.common) {
        config.common.constants.FIND_SYMBOL_CONTAINERS = 10021;
        config.common.constants.LOOK_SYMBOL_CONTAINERS = "symbolContainer";

        config.common.constants.SYMBOL_CONTAINER_SPAWN_CHANCE = 0.01;
        config.common.constants.SYMBOL_CONTAINER_SPAWN_INTERVAL_TICKS = 250; // ticks
    }

    if (config.backend) {
        config.backend.customObjectTypes.symbolContainer = {
            sidepanel: '<div><label class="body-header">Store:</label>' +
                    '<div ng-if="!Room.calcResources(Room.selectedObject)"> Empty </div>' +
                    '<div ng-if="Room.calcResources(Room.selectedObject)">' +
                        '<table ng-repeat="(resourceType, amount) in Room.selectedObject.store" ng-if="amount > 0">' +
                            '<td>{{amount | number}}&nbsp;&times;&nbsp;</td>' +
                            '<td><img class="resource-type" ng-src="https://s3.amazonaws.com/static.screeps.com/upload/mineral-icons/{{Room.selectedObject.resourceType}}.png" uib-tooltip="{{Room.selectedObject.resourceType}}"></td>' +
                        '</table>' +
                    '</div>' +
                '</div>' +
                '<div><label>Decay in:</label><span>{{object.decayTime - Room.gameTime}}</span></div>'
        };

        require('./symbolContainer.renderer')(config);
    }

    if(config.engine) {
        config.engine.registerCustomObjectPrototype('symbolContainer', 'SymbolContainer', {
            properties: {
                resourceType: object => object.resourceType
            },
            prototypeExtender (prototype, scope, {utils}) {
                const data = id => {
                    if (!scope.runtimeData.roomObjects[id]) {
                        throw new Error("Could not find an object with ID " + id);
                    }
                    return scope.runtimeData.roomObjects[id];
                };

                utils.defineGameObjectProperties(prototype, data, {
                    store: o => new scope.globals.Store(o),
                    ticksToDecay: o => o.decayTime - scope.runtimeData.time
                });

                prototype.toString = function() { return `[symbolContainer #${this.id}]` };
            },
            findConstant: config.common.constants.FIND_SYMBOL_CONTAINERS,
            lookConstant: config.common.constants.LOOK_SYMBOL_CONTAINERS
        });

        config.engine.on('processObject', function (object, roomObjects, roomTerrain, gameTime, roomInfo, objectsUpdate, usersUpdate) {
            if (object.type == 'symbolContainer') {
                if (!_.sum(object.store) || (object.decayTime <= gameTime)) {
                    objectsUpdate.remove(object._id);
                    delete roomObjects[object._id]
                }
                roomInfo.active = true;
            }
        });

        config.engine.on('processRoom', function(roomId, roomInfo, roomObjects, roomTerrain, gameTime, bulk, bulkUsers, eventLog) {
            for(let event of eventLog) {
                if((event.event == config.common.constants.EVENT_TRANSFER) &&
                    roomObjects[event.objectId] &&
                    (roomObjects[event.objectId].type == 'symbolContainer') &&
                    event.data.targetId &&
                    roomObjects[event.data.targetId] &&
                    roomObjects[event.data.targetId].user)
                {
                    console.log(`Symbol pickup in ${roomInfo._id}`);
                    roomInfo.symbols = roomInfo.symbols || {};
                    roomInfo.symbols[event.data.resourceType] = (roomInfo.symbols[event.data.resourceType] || 0) + event.data.amount;
                }
            }
        });

    }

    if(config.cronjobs) {
        config.cronjobs.genSymbolContainers = [60, async ({utils}) => {
            const { db, env } = config.common.storage;
            const gameTime = parseInt(await env.get(env.keys.GAMETIME));
            if(!gameTime || (gameTime <= 1)) {
                return;
            }

            const lastSymbolContainersSpawnTick = parseInt(await env.get('lastSymbolContainersSpawnTick'));
            if((gameTime - lastSymbolContainersSpawnTick) < config.common.constants.SYMBOL_CONTAINER_SPAWN_INTERVAL_TICKS) {
                return;
            }

            const rooms = await db.rooms.find({status: {$ne: 'out of borders'}});
            for(let room of rooms) {
                if(Math.random() < config.common.constants.SYMBOL_CONTAINER_SPAWN_CHANCE) {
                    const freePos = await utils.findFreePos(room._id, 0);
                    if(!freePos) {
                        console.log(`No free position for score source in ${room._id}`);
                        return;
                    }
                    const densityRoll = 100*Math.random();
                    let amount = 500 + Math.round(2000*Math.random());
                    let decay = 500 + Math.round(2000*Math.random());
                    if(densityRoll <= 47) {
                        amount = 3500 + Math.round(3000*Math.random());
                        decay = 3500 + Math.round(3000*Math.random());
                    }
                    if(densityRoll <= 18) {
                        amount = 8500 + Math.round(3000*Math.random());
                        decay = 8500 + Math.round(3000*Math.random());
                    }

                    const decayTime = gameTime + Math.min(maxDecay, decay);
                    const resourceType = _.sample(config.common.constants.SYMBOLS);
                    await db['rooms.objects'].insert({
                        type: 'symbolContainer',
                        room: room._id,
                        x: freePos.x,
                        y: freePos.y,
                        resourceType,
                        store: {[resourceType]: amount},
                        decayTime
                    });
                    await utils.activateRoom(room._id);
                    console.log(`Spawned symbol container in ${freePos.x}:${freePos.y}@${room._id} (${resourceType}: ${amount}, roll ${densityRoll})`);
                }
            }
            await env.set('lastSymbolContainersSpawnTick', gameTime);
        }];
    }
};
