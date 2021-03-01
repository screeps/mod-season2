
module.exports = function(config) {
    if(config.backend) {
        for(const symbol of config.common.constants.SYMBOLS) {
            config.backend.renderer.resources[`${symbol}-container`] = `${config.assetsUrl}${symbol}-container.svg`;
        }

        config.backend.renderer.metadata.symbolContainer = {
            calculations: [
                {
                    id: 'symbol',
                    props: ['resourceType'],
                    func: { $concat: [{$state: 'resourceType'}, '-container'] }
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
                        width: 90,
                        height: 90
                    },
                },
                {
                    type: 'sprite',
                    layer: 'lighting',
                    payload: {
                        texture: { $calc: 'symbol' },
                        width: 90,
                        height: 90
                    },
                },
                {
                    id: 'light',
                    type: 'sprite',
                    layer: 'lighting',
                    once: true,
                    payload: {
                        texture: 'glow',
                        width: 300,
                        height: 300,
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
            zIndex: 4,
        };
    }
}
