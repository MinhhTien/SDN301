"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
const userController = new user_controller_1.UserController();
userRouter.route('/login').get(userController.renderLogin).post(userController.login);
userRouter.route('/signup').get(userController.renderSignup).post(userController.signup);
exports.default = userRouter;
