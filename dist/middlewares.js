"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = exports.Authorization = void 0;
const Authorization = (roles) => {
    return (req, res, next) => {
        if (req.session.user) {
            const user = req.session.user;
            if (roles.includes(user.role)) {
                next();
            }
            else {
                res.render('404', {
                    isLoggedIn: !!req.session.user,
                    user: req.session.user
                });
            }
        }
        else {
            res.render('404', {
                isLoggedIn: !!req.session.user,
                user: req.session.user
            });
        }
    };
};
exports.Authorization = Authorization;
const AuthRoute = (req, res, next) => {
    if (!req.session.user) {
        next();
    }
    else {
        res.redirect('/');
    }
};
exports.AuthRoute = AuthRoute;
