module.exports = function (config) {
    config.assetsUrl = '{ASSETS_URL}season2/';

    if (config.backend && config.backend.features) {
        config.backend.features.push({ name: 'season2', version: 1 })
    }

    try{
        require('./official-specific')(config);
    } catch {}

    require('./resources')(config);
    require('./runtime')(config);
    require('./symbolContainer.roomObject')(config);
    require('./symbolDecoder.roomObject')(config);
    require('./decorations')(config);
    require('./scoreboard')(config);
    require('./terminal-restriction')(config);
    require('./stronghold-rewards')(config);
};
