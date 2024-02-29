"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const constant_1 = require("../common/constant");
const common_1 = require("../utils/common");
class UserController {
    renderLogin(req, res) {
        try {
            res.render('./auth/login', { layout: false, isLoggedIn: !!req.session.user, user: req.session.user });
        }
        catch (err) {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    renderSignup(req, res, next) {
        try {
            res.render('./auth/signup', { layout: false, isLoggedIn: !!req.session.user, user: req.session.user });
        }
        catch (err) {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await user_model_1.default.findOne({
                username
            }, '+password').lean();
            if (!user) {
                return res.render('400', {
                    errorMessage: `Username or password is incorrect! Please try again.`,
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
            const isPasswordMatch = await (0, common_1.comparePassword)(password, user.password);
            if (!isPasswordMatch) {
                return res.render('400', {
                    errorMessage: `Username or password is incorrect! Please try again.`,
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
            user.password = '';
            req.session.user = user;
            if (user.role === constant_1.UserRole.ADMIN) {
                return res.redirect('/orchids/management');
            }
            if (user.role === constant_1.UserRole.MEMBER) {
                return res.redirect('/orchids');
            }
            return res.redirect('/');
        }
        catch (err) {
            console.error(err);
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async signup(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const confirmPassword = req.body.confirmPassword;
            if (password !== confirmPassword) {
                return res.render('400', {
                    errorMessage: `Confirm password not match! Please try again.`,
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
            const user = await user_model_1.default.findOne({
                username
            }, { password: 1 }).lean();
            if (user) {
                return res.render('400', {
                    errorMessage: `Username ${username} has existed! Please try another username.`,
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
            const hashedPassword = await (0, common_1.hashPassword)(password);
            await user_model_1.default.create({
                username,
                password: hashedPassword,
                role: constant_1.UserRole.MEMBER
            });
            return res.redirect('/login');
        }
        catch (err) {
            console.error(err);
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
    async logout(req, res, next) {
        req.session.destroy(() => {
            console.log('User logged out');
        });
        res.redirect('/');
    }
    async renderAllAccounts(req, res, next) {
        try {
            const users = await user_model_1.default.find({
                role: {
                    $ne: constant_1.UserRole.ADMIN
                }
            }, '-password').lean();
            res.render('./users/management', {
                users,
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
        catch (err) {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    }
}
exports.UserController = UserController;
