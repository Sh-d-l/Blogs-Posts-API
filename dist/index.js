"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
const blog_API_router_1 = require("./blog_API-router/blog_API-router");
const post_API_router_1 = require("./post_API-router/post_API-router");
const deleteAll_1 = require("./deleteAll/deleteAll");
app.use("/blogs", blog_API_router_1.blog_Router);
app.use("/posts", post_API_router_1.post_Router);
app.use("/all-data", deleteAll_1.delAll_Router);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map