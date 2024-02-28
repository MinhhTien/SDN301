"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const constant_1 = require("../common/constant");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    renderLogin(req, res) {
        try {
            res.render('./auth/login');
        }
        catch (err) {
            res.render('404');
        }
    }
    renderSignup(req, res, next) {
        try {
            res.render('./auth/signup');
        }
        catch (err) {
            res.render('404');
        }
    }
    async login(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const user = await user_model_1.default.findOne({
                username
            }, { password: 1 }).lean();
            if (!user) {
                return res.render('400', {
                    errorMessage: `Username or password is incorrect! Please try again.`
                });
            }
            const isPasswordMatch = await this._comparePassword(password, user.password);
            if (!isPasswordMatch) {
                return res.render('400', {
                    errorMessage: `Username or password is incorrect! Please try again.`
                });
            }
            if (user.role === constant_1.UserRole.ADMIN) {
                return res.redirect('/orchids/management');
            }
            if (user.role === constant_1.UserRole.MEMBER) {
                return res.redirect('/orchids/all');
            }
            return res.redirect('/');
        }
        catch (err) {
            console.error(err);
            res.render('404');
        }
    }
    async signup(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const user = await user_model_1.default.findOne({
                username
            }, { password: 1 }).lean();
            if (user) {
                return res.render('400', {
                    errorMessage: `Username ${username} has existed! Please try another username.`
                });
            }
            const hashedPassword = await this._hashPassword(password);
            await user_model_1.default.create({
                username,
                password: hashedPassword,
                role: constant_1.UserRole.MEMBER
            });
            return res.redirect('/login');
        }
        catch (err) {
            console.error(err);
            res.render('404');
        }
    }
    async _hashPassword(password) {
        const salt = await bcryptjs_1.default.genSalt();
        const hash = await bcryptjs_1.default.hash(password, salt);
        return hash;
    }
    _comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
}
exports.UserController = UserController;
