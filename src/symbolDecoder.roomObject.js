const _ = require('lodash'),
    common = require('@screeps/common');

module.exports = function(config) {
    if(config.common) {
        config.common.constants.FIND_SYMBOL_DECODERS = 10022;
        config.common.constants.LOOK_SYMBOL_DECODERS = "symbolDecoder";
    }

    if(config.backend) {
        config.backend.customObjectTypes.symbolDecoder = {
            sidepanel: '<div>' +
                '<label class="body-header">Symbol:&nbsp;' +
                    '<span class="pull-right">' +
                        ' <img class="resource-type" ng-src="https://s3.amazonaws.com/static.screeps.com/upload/mineral-icons/{{Room.selectedObject.resourceType}}.png" uib-tooltip="{{Room.selectedObject.resourceType}}"></span>' +
                '</label>' +
            '</div>' +
            '<div>' +
                '<label class="body-header">Score multiplier:&nbsp;' +
                `<span class="pull-right">{{(${JSON.stringify(config.common.constants.CONTROLLER_LEVEL_SCORE_MULTIPLIERS)})[Room.roomController.level||0]}}</span>` +
                '</label>' +
            '</div>'
        };
    }

    require('./symbolDecoder.renderer')(config);

    if(config.engine) {
        config.engine.registerCustomObjectPrototype('symbolDecoder', 'SymbolDecoder', {
            properties: {
            },
            prototypeExtender (prototype, scope, {utils}) {
                const data = id => {
                    if (!scope.runtimeData.roomObjects[id]) {
                        throw new Error("Could not find an object with ID " + id);
                    }
                    return scope.runtimeData.roomObjects[id];
                };

                utils.defineGameObjectProperties(prototype, data, {
                    resourceType: o => o.resourceType,
                    scoreMultiplier: o => scope.globals.CONTROLLER_LEVEL_SCORE_MULTIPLIERS[scope.register.rooms[o.room].controller.level||0]
                });
                prototype.toString = function() { return `[symbolDecoder #${this.id}]` };
            },
            findConstant: config.common.constants.FIND_SYMBOL_DECODERS,
            lookConstant: config.common.constants.LOOK_SYMBOL_DECODERS
        });

        config.engine.on('postProcessObject', function (object, roomObjects, roomTerrain, gameTime, roomInfo, bulk, bulkUsers, eventLog) {
            if(object.type == 'symbolDecoder') {
                if(object.store[object.resourceType]) {
                    bulk.update(object, {store: {[object.resourceType]: 0}});
                }
                roomInfo.active = true;
            }
        });
        config.engine.on('processRoom', function(roomId, roomInfo, roomObjects, roomTerrain, gameTime, bulk, bulkUsers, eventLog) {
            for(let event of eventLog) {
                if((event.event == config.common.constants.EVENT_TRANSFER) &&
                    roomObjects[event.data.targetId] &&
                    (roomObjects[event.data.targetId].type == 'symbolDecoder') &&
                    (event.data.resourceType == roomObjects[event.data.targetId].resourceType)) {
                    const object = roomObjects[event.objectId];
                    const controller = _.find(roomObjects, {type: 'controller'});
                    if(object && controller && controller.level) {
                        bulkUsers.inc(object.user, `resources.symbols.${event.data.resourceType}`, event.data.amount);
                    }
                }
            }
        });
    }
    if (config.cronjobs) {
        config.cronjobs.genDecoders = [365 * 24 * 60 * 60, async ({utils}) => {
            const C = config.common.constants;
            const {db, env} = config.common.storage;

            // run once
            if(await env.get('decodersGenerated')) {
                return;
            }

            const roomObjects = await db['rooms.objects'].find({});
            const controllers = _.filter(roomObjects, {type: 'controller'});
            for(let controller of controllers) {
                const decoder = _.find(roomObjects, {type: 'symbolDecoder', room: controller.room});
                if(decoder) {
                    continue;
                }
                console.log(`No decoder in room ${controller.room}`);
                const wallObjects = _.filter(roomObjects,
                        o => o.room == controller.room &&
                            _.includes(['source', 'mineral', 'controller'], o.type));

                const roomTerrain = await db['rooms.terrain'].findOne({room: controller.room});
                const terrain = roomTerrain.terrain;

                let mx,my,isWall,hasSpot,hasObjects;
                do {
                    mx = 2 + Math.floor(Math.random()*46);
                    my = 2 + Math.floor(Math.random()*46);
                    isWall = common.checkTerrain(terrain, mx, my, C.TERRAIN_MASK_WALL);
                    hasSpot = false;
                    for(let dx=-1;dx<=1;dx++) {
                        for(let dy=-1;dy<=1;dy++) {
                            if(!common.checkTerrain(terrain,mx+dx,my+dy, C.TERRAIN_MASK_WALL)) {
                                hasSpot = true;
                            }
                        }
                    }
                    hasObjects = _.any(wallObjects, i => Math.abs(i.x - mx) < 5 && Math.abs(i.y - my) < 5);
                }
                while(!isWall || !hasSpot || hasObjects);

                const resourceType = _.sample(C.SYMBOLS);
                await db['rooms.objects'].insert({
                    room: controller.room,
                    x: mx,
                    y: my,
                    type: 'symbolDecoder',
                    resourceType,
                    store: {},
                    storeCapacityResource: {[resourceType]: 1000000}
                });
                console.log(`${controller.room}: ${mx},${my}`);
            }

            await env.set('decodersGenerated', 1);
        }];
    }
}
