"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class checkMiddlerWares {
    static checkLogin(req, res, next) {
        const user = req.session.user;
        if (user) {
            next();
        }
        else {
            res.redirect('/singnup');
        }
    }
    static checkIsAdmin(req, res, next) {
        const user = req.session.user;
        if (user && user.isadmin === 1) {
            next();
        }
        else {
            res.redirect('/');
        }
    }
}
exports.default = checkMiddlerWares;
