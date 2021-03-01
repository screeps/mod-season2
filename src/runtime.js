const _ = require('lodash');

module.exports = function (config) {
    if(config.engine) {
        config.engine.registerCustomObjectPrototype('dummy', '__dummy', {
            parent: 'Object',
            properties: {},
            prototypeExtender (prototype, scope, {utils}) {
                scope.globals.__Game = Object.create(null);

                Object.defineProperty(scope.globals.__Game, 'symbols', {
                    configurable: false,
                    enumerable: true,
                    get: () => scope.globals.SYMBOLS.reduce((a, v) => (a[v]=(scope.runtimeData.user.resources.symbols||{})[v]||0,a), {})
                });
                Object.defineProperty(scope.globals.__Game, 'score', {
                    configurable: false,
                    enumerable: true,
                    get: () => [...Object.values(scope.runtimeData.user.resources.symbols||{})].sort().reduce((a, v, k) => (a+v*(1+k)), 0)
                });
            }
        });

        config.engine.on('playerSandbox', sandbox => {
            sandbox.run('Object.assign(global.Game,global.__Game); delete global.__Game; delete global.__dummy;');
        });
    }
}
