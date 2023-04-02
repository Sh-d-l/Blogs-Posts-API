"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidator = void 0;
const express_validator_1 = require("express-validator");
const inputValidator = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({ onlyFirstError: true }).map(el => ({
            message: el.msg,
            field: el.param
        }));
        return res.status(400).json({ errorsMessages });
    }
    else {
        next();
    }
};
exports.inputValidator = inputValidator;
