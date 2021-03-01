const colors = {
    symbol_aleph: 0xC63946,
    symbol_beth: 0xB72E6F,
    symbol_gimmel: 0xB72FA5,
    symbol_daleth: 0xA334B7,
    symbol_he: 0x9D41ED,
    symbol_waw: 0x8441ED,
    symbol_zayin: 0x6E49FF,
    symbol_heth: 0x4E71FF,
    symbol_teth: 0x5088F4,
    symbol_yodh: 0x3DA1EA,
    symbol_kaph: 0x38A9C7,
    symbol_lamedh: 0x35B7B5,
    symbol_mem: 0x36B79A,
    symbol_nun: 0x33B75D,
    symbol_samekh: 0x3FB147,
    symbol_ayin: 0x69A239,
    symbol_pe: 0x7EA232,
    symbol_tsade: 0x9FA23B,
    symbol_qoph: 0xBB933A,
    symbol_res: 0xD88942,
    symbol_sim: 0xDC763D,
    symbol_taw: 0xD64B3D
};

let calc = 0x000000;
for(let symbol in colors) {
    calc = { $if: {$eq: [{$state: 'resourceType'}, symbol]}, then: colors[symbol], else: calc };
}

module.exports.colorCalc = calc;
