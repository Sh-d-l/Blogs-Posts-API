"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundUserById = exports.incorrectPatternEmailUser = exports.incorrectPatternLoginUser = exports.incorrectLengthPassUserMore = exports.incorrectLengthPassUserLess = exports.incorrectLengthLoginUserMore = exports.incorrectLengthLoginUserLess = exports.incorrectPassUserString = exports.incorrectPassUser = exports.incorrectEmailUser = exports.incorrectLoginUser = exports.passUser = exports.emailUser = exports.loginUser = exports.urlUser = void 0;
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../src");
const authUsers_constans_1 = require("./authUsers.constans");
exports.urlUser = "/users/";
exports.loginUser = "oNnbmkPJLG";
exports.emailUser = 'r2UIs0_HUM3SRliZOWZh1TgZC7P3k9KeVu-Svw861BR' +
    'omwFo1-CgLiSvm._0oEszPRsH5K.sFKQF2szSs4qniEzS8SyRYOE@ZgTZbvRd' +
    'y3mG6L3Yy_U-YjMwJtGi9lgIf7VJk0_VK1u8Cw3a6Vt_NU8a35YCcGvbL_78nNrr' +
    '0R7y.dq1rMd51TmDVxod6_MVSzDZN8L8mxMQ-aHjw91_XSqbV6LO2XzrMie0VHSlS' +
    'ldvMSiRWcMn.u9TizR80w_dLTh6hBUiqEuF8EmMZ.WRbvs7zUPTvn1_.oodSYLCn8' +
    '_CuHsiD8XuwCVy2LHQNkDM42.mUfXL1gWBW-FZWTSrQo2_T5FQ0TN.zV14LTblzqt' +
    'Pj1xk.qBhALMG.WtU31wuQU_qiugi5f84X5ra9d8.SQ19yszY8bZpUO2kQOnHW1o2L' +
    '0I51KCLkXID6P1a871f_hzgBGcJzpb336dXXN38fvDdulO4wsglL_.e-A_2idyCBXb' +
    'gI2XYlF85nZiC3h9UClR3n7wm9MN3Vf.NhIDaOO7oWfOJbM.P-6WpcDFRZ3.diasZrQ' +
    'PjXFK2FHgOfBzHu0v1RG2jwVYZTx0qAJhkDnIjkrOIE.wuVGsea6WJxskJW-luOkhX' +
    's2d1tT38llLjcNu2cMny7-AQRaNlPwqIptlChrpv2_mFiYSmz2M-vDS23naWttM5dVA' +
    'q9zplp.ydch0cDtEocGjIDJ9CSxAso3EF1wc8ciuAXiDYzLRI.eetqu2uf53SbZ-2qU' +
    'ddmiEt78Q6pK8y9l46m-jlSSFtLpAcqawEMSrVEMiPMylV152uEr0.vBLdvVPEP-u37' +
    'wx5ZPbpcJaXyaXYCBJgWLa-o.-ZudoAdluHqbLW73Y6ztaNlGXpk-YtGW8qF5IzQd6Oq' +
    's3kDiBL37Nkg77hw0lVoy2WEBuoXOXHgB0MDhdl46Umz-7xpvuGqoBq16B.PPfNi203N' +
    'Hqh96.EHADvbw5IV4xUjEfqGOfz5kjEpUHcPnl6i7V3Lmdl2uB7LSrzxChst27yUGWUhedrTaW' +
    'lDrk5Cx.0ZK9PEPunc3vbxM2IZUAiadVAvIs9g5VrZb0e3bpMnfdA6rpV0RCxIbzXtpMJb1' +
    '8me1ktRAL.zDmV-pxxPAB6u4fTR9CGzkmwKQQFCyiEMFJlpqG6Zxc9mVhDCYqUbWe.OApL' +
    'cAWAXplUzkDOCsKYaQP4VuDsE12ZezRpD4KaWxYb8K1fq2M9grsw1DDy9jL1.vWOviwZj' +
    '__58Vz-a3jMsTASHOpWrnyWZy81E9M7s7OagX2tIU.XOYx_.B7M.2wz_ewC7kkCJmQxS95_.8rk';
exports.passUser = "string";
exports.incorrectLoginUser = 123;
exports.incorrectEmailUser = 123;
exports.incorrectPassUser = 123;
exports.incorrectPassUserString = "qweqeeq";
exports.incorrectLengthLoginUserLess = "1";
exports.incorrectLengthLoginUserMore = "51444444444444444444444444444444444";
exports.incorrectLengthPassUserLess = "2";
exports.incorrectLengthPassUserMore = "44444444444444444444444444444444444444444444444444444444444444444444444444";
exports.incorrectPatternLoginUser = /^[acv-zA-Z0-9_-]*$/;
exports.incorrectPatternEmailUser = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4245iuy}$/;
const foundUserById = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, supertest_1.default)(src_1.app)
        .get(exports.urlUser)
        .auth(authUsers_constans_1.loginAuth, authUsers_constans_1.passAuth)
        .expect(200);
    return users.body.items[0].id;
});
exports.foundUserById = foundUserById;
//# sourceMappingURL=user.constans.js.map