module.exports = function (config) {
    if(config.common) {
        config.common.constants.RESOURCE_SYMBOL_ALEPH   = 'symbol_aleph'; // 𐤀
        config.common.constants.RESOURCE_SYMBOL_BETH    = 'symbol_beth'; // 𐤁
        config.common.constants.RESOURCE_SYMBOL_GIMMEL  = 'symbol_gimmel'; // 𐤂
        config.common.constants.RESOURCE_SYMBOL_DALETH  = 'symbol_daleth'; // 𐤃
        config.common.constants.RESOURCE_SYMBOL_HE      = 'symbol_he'; // 𐤄
        config.common.constants.RESOURCE_SYMBOL_WAW     = 'symbol_waw'; // 𐤅
        config.common.constants.RESOURCE_SYMBOL_ZAYIN   = 'symbol_zayin'; // 𐤆
        config.common.constants.RESOURCE_SYMBOL_HETH    = 'symbol_heth'; // 𐤇
        config.common.constants.RESOURCE_SYMBOL_TETH    = 'symbol_teth'; // 𐤈
        config.common.constants.RESOURCE_SYMBOL_YODH    = 'symbol_yodh'; // 𐤉
        config.common.constants.RESOURCE_SYMBOL_KAPH    = 'symbol_kaph'; // 𐤊
        config.common.constants.RESOURCE_SYMBOL_LAMEDH  = 'symbol_lamedh'; // 𐤋
        config.common.constants.RESOURCE_SYMBOL_MEM     = 'symbol_mem'; // 𐤌
        config.common.constants.RESOURCE_SYMBOL_NUN     = 'symbol_nun'; // 𐤍
        config.common.constants.RESOURCE_SYMBOL_SAMEKH  = 'symbol_samekh'; // 𐤎
        config.common.constants.RESOURCE_SYMBOL_AYIN    = 'symbol_ayin'; // 𐤏
        config.common.constants.RESOURCE_SYMBOL_PE      = 'symbol_pe'; // 𐤐
        config.common.constants.RESOURCE_SYMBOL_TSADE   = 'symbol_tsade'; // 𐤑
        config.common.constants.RESOURCE_SYMBOL_QOPH    = 'symbol_qoph'; // 𐤒
        config.common.constants.RESOURCE_SYMBOL_RES     = 'symbol_res'; // 𐤓
        config.common.constants.RESOURCE_SYMBOL_SIN     = 'symbol_sim'; // 𐤔
        config.common.constants.RESOURCE_SYMBOL_TAW     = 'symbol_taw'; // 𐤕

        config.common.constants.SYMBOLS = [
            config.common.constants.RESOURCE_SYMBOL_ALEPH,
            config.common.constants.RESOURCE_SYMBOL_BETH,
            config.common.constants.RESOURCE_SYMBOL_GIMMEL,
            config.common.constants.RESOURCE_SYMBOL_DALETH,
            config.common.constants.RESOURCE_SYMBOL_HE,
            config.common.constants.RESOURCE_SYMBOL_WAW,
            config.common.constants.RESOURCE_SYMBOL_ZAYIN,
            config.common.constants.RESOURCE_SYMBOL_HETH,
            config.common.constants.RESOURCE_SYMBOL_TETH,
            config.common.constants.RESOURCE_SYMBOL_YODH,
            config.common.constants.RESOURCE_SYMBOL_KAPH,
            config.common.constants.RESOURCE_SYMBOL_LAMEDH,
            config.common.constants.RESOURCE_SYMBOL_MEM,
            config.common.constants.RESOURCE_SYMBOL_NUN,
            config.common.constants.RESOURCE_SYMBOL_SAMEKH,
            config.common.constants.RESOURCE_SYMBOL_AYIN,
            config.common.constants.RESOURCE_SYMBOL_PE,
            config.common.constants.RESOURCE_SYMBOL_TSADE,
            config.common.constants.RESOURCE_SYMBOL_QOPH,
            config.common.constants.RESOURCE_SYMBOL_RES,
            config.common.constants.RESOURCE_SYMBOL_SIN,
            config.common.constants.RESOURCE_SYMBOL_TAW
        ];

        config.common.constants.RESOURCES_ALL.push(...config.common.constants.SYMBOLS);

        config.common.constants.CONTROLLER_LEVEL_SCORE_MULTIPLIERS = [0, 1, 1, 1, 3, 9, 27, 81, 243];
    }
}
