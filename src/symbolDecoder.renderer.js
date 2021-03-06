module.exports = function(config) {
    if(config.backend) {
        for(const symbol of config.common.constants.SYMBOLS) {
            config.backend.renderer.resources[`${symbol}-decoder`] = `${config.assetsUrl}${symbol}-decoder.svg`;
        }
        config.backend.renderer.metadata.symbolDecoder = {
            calculations: [
                {
                    id: 'symbol',
                    props: ['resourceType'],
                    func: { $concat: [{$state: 'resourceType'}, '-decoder'] }
                },
                {
                    id: 'color',
                    props: ['resourceType'],
                    once: true,
                    func: require('./renderer.utils').colorCalc
                }
            ],
            processors: [
                {
                    type: 'sprite',
                    payload: {
                        texture: { $calc: 'symbol' },
                        width: 180,
                        height: 180
                    },
                },
                {
                    type: 'sprite',
                    layer: 'lighting',
                    payload: {
                        texture: { $calc: 'symbol' },
                        width: 180,
                        height: 180
                    },
                },
                {
                    id: 'light',
                    type: 'sprite',
                    layer: 'lighting',
                    once: true,
                    payload: {
                        texture: 'glow',
                        width: 900,
                        height: 900,
                        alpha: 1,
                        tint: { $calc: 'color' },
                    },
                    actions: [
                        {
                            action: 'Repeat',
                            params: [
                                {
                                    action: 'Sequence',
                                    params: [
                                        [
                                            { action: 'TintTo', params: [ 0x000000, 1 ] },
                                            { action: 'TintTo', params: [ { $calc: 'color' }, 1 ] }
                                        ],
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            zIndex: 1,
        };
    }
}
