"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = void 0;
exports.basicAuth = ((req, res, next) => {
    if (req.headers.authorization !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401);
    }
    else {
        next();
    }
});
