"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _middlewares_1 = require("../middlewares");
const constant_1 = require("../common/constant");
const comment_controller_1 = require("../controllers/comment.controller");
const commentRouter = express_1.default.Router();
const commentController = new comment_controller_1.CommentController();
commentRouter.route('/').post((0, _middlewares_1.Authorization)([constant_1.UserRole.MEMBER]), commentController.createComment);
exports.default = commentRouter;
