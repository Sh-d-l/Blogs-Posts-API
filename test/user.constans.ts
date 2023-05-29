import request from "supertest";
import {app} from "../src";
import {loginAuth, passAuth} from "./authUsers.constans";

export const urlUser = "/users/";
export const loginUser = "oNnbmkPJLG";
export const emailUser = 'r2UIs0_HUM3SRliZOWZh1TgZC7P3k9KeVu-Svw861BR' +
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
export const passUser = "string";
export const incorrectLoginUser = 123;
export const incorrectEmailUser = 123;
export const incorrectPassUser = 123;
export const incorrectPassUserString = "qweqeeq"
export const incorrectLengthLoginUserLess = "1"
export const incorrectLengthLoginUserMore = "51444444444444444444444444444444444"
export const incorrectLengthPassUserLess = "2"
export const incorrectLengthPassUserMore = "44444444444444444444444444444444444444444444444444444444444444444444444444"
export const incorrectPatternLoginUser = /^[acv-zA-Z0-9_-]*$/;
export const incorrectPatternEmailUser = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4245iuy}$/
export const foundUserById = async () => {
    const users = await request(app)
        .get(urlUser)
        .auth(loginAuth, passAuth)
        .expect(200);
    return users.body.items[0].id;
}
