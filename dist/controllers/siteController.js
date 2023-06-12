"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class siteController {
    static index(req, res, next) {
        // return
        const user = req.session.user;
        if (user) {
            res.render('index', { user: user });
            return;
        }
        res.render('blog');
    }
}
exports.default = siteController;
