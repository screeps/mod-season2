const _ = require('lodash'), q = require('q');

module.exports = function (config) {
    if(config.common) {
        const C = config.common.constants;
        config.common.strongholds.containerRewards = { X: 10, OH: 2, UL: 2, ZK: 2 };
        config.common.strongholds.containerAmounts = [0, 100, 500, 2000, 2000, 2000];

        config.common.strongholds.coreRewards = {
            symbols: [
                C.SYMBOLS,
                C.SYMBOLS,
                [
                    C.RESOURCE_UTRIUM_BAR,
                    C.RESOURCE_LEMERGIUM_BAR,
                    C.RESOURCE_ZYNTHIUM_BAR,
                    C.RESOURCE_KEANIUM_BAR,
                    C.RESOURCE_OXIDANT,
                    C.RESOURCE_REDUCTANT,
                    C.RESOURCE_PURIFIER
                ],
                [
                    C.RESOURCE_UTRIUM_HYDRIDE,
                    C.RESOURCE_UTRIUM_OXIDE,
                    C.RESOURCE_LEMERGIUM_HYDRIDE,
                    C.RESOURCE_LEMERGIUM_OXIDE,
                    C.RESOURCE_ZYNTHIUM_HYDRIDE,
                    C.RESOURCE_ZYNTHIUM_OXIDE,
                    C.RESOURCE_KEANIUM_HYDRIDE,
                    C.RESOURCE_KEANIUM_OXIDE,
                    C.RESOURCE_HYDROXIDE,
                    C.RESOURCE_ZYNTHIUM_KEANITE,
                    C.RESOURCE_UTRIUM_LEMERGITE
                ],
                [
                    C.RESOURCE_UTRIUM_ACID,
                    C.RESOURCE_UTRIUM_ALKALIDE,
                    C.RESOURCE_LEMERGIUM_ACID,
                    C.RESOURCE_LEMERGIUM_ALKALIDE,
                    C.RESOURCE_ZYNTHIUM_ACID,
                    C.RESOURCE_ZYNTHIUM_ALKALIDE,
                    C.RESOURCE_KEANIUM_ACID,
                    C.RESOURCE_KEANIUM_ALKALIDE,
                    C.RESOURCE_GHODIUM_HYDRIDE,
                    C.RESOURCE_GHODIUM_OXIDE
                ],
                [
                    C.RESOURCE_CATALYZED_UTRIUM_ACID,
                    C.RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
                    C.RESOURCE_CATALYZED_LEMERGIUM_ACID,
                    C.RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
                    C.RESOURCE_CATALYZED_ZYNTHIUM_ACID,
                    C.RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
                    C.RESOURCE_CATALYZED_KEANIUM_ACID,
                    C.RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
                    C.RESOURCE_GHODIUM_ACID,
                    C.RESOURCE_GHODIUM_ALKALIDE
                ]
            ]
        };
        config.common.strongholds.coreDensities = [3, 3, 5, 9, 15, 30];
        config.common.strongholds.coreAmounts = [0, 1000, 16000, 60000, 400000, 3000000]
    }

    if (config.cronjobs) {
        config.cronjobs.updateInvaderCore = [60, async () => {
            const {db} = config.common.storage;
            await db['rooms.objects'].update({type: 'invaderCore', depositType: {$ne: 'symbols'}}, {$set: {depositType: 'symbols'}})
        }];
    }
};
