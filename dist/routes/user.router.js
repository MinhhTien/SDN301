"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const _middlewares_1 = require("../middlewares");
const constant_1 = require("../common/constant");
const userRouter = express_1.default.Router();
const userController = new user_controller_1.UserController();
userRouter.route('/login').get(_middlewares_1.AuthRoute, userController.renderLogin).post(userController.login);
userRouter.route('/signup').get(_middlewares_1.AuthRoute, userController.renderSignup).post(userController.signup);
userRouter.route('/logout').get((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN, constant_1.UserRole.MEMBER]), userController.logout);
userRouter.route('/accounts').get((0, _middlewares_1.Authorization)([constant_1.UserRole.ADMIN]), userController.renderAllAccounts);
exports.default = userRouter;
