"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/database/User");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const bcrypt = require('bcrypt');
const passport = require('passport');
const crypto = require('crypto');
const joi = require('joi');
class loginController {
    static index(req, res, next) {
        res.render('singnup');
    }
    static commit_a(req, res, next) {
        res.render('hotel');
    }
    static commit(req, res, next) {
        // const user = req.user
        // req.session.user = user
        // if (user.isadmin == 1) {
        //     res.json({
        //         url: '/admin'
        //     })
        // } else {
        //     res.json({
        //         url: '/'
        //     })
        // }
        passport.authenticate('local', { session: true }, async (err, user, info) => {
            try {
                if (err || !user) {
                    const message = info ? info.message : 'Đăng nhập thất bại';
                    res.json({ message: message });
                    return;
                }
                req.session.user = user;
                if (user.isadmin == 1) {
                    res.json({
                        url: '/admin'
                    });
                }
                else {
                    res.json({
                        url: '/'
                    });
                }
            }
            catch (err) {
                next(err);
            }
        })(req, res);
    }
    static index_register(req, res) {
        res.render('register');
    }
    static async commit_register(req, res) {
        const schema = joi.object({
            name: joi.string().required().max(30).error(new Error('Tên không hợp lệ')),
            username: joi.string().required().email().min(8).max(30).error(new Error('Email không hợp lệ')),
            password: joi.string().required().min(8).max(30).error(new Error('Password không hợp lệ')),
            passwordAgain: joi.string().required().min(8).max(30).error(new Error('passwordAgain không hợp lệ'))
        });
        const result = schema.validate(req.body);
        if (result.error) {
            const errMessage = result.error.message;
            res.json({ message: errMessage });
            return;
        }
        const user = await User_1.User.findOneBy({ email: req.body.username });
        if (user) {
            res.json({ message: 'email đã tồn tại' });
        }
        else {
            const password = req.body.password;
            const passwordAgain = req.body.passwordAgain;
            if (password != passwordAgain) {
                res.json({ message: 'Password sai! vui lòng nhập lại' });
            }
            else {
                const salt = bcrypt.genSaltSync(12);
                const passwordUser = bcrypt.hashSync(req.body.password, salt);
                const userNew = new User_1.User();
                userNew.name = req.body.name;
                userNew.email = req.body.username;
                userNew.password = passwordUser;
                userNew.save();
                res.json({
                    url: '/'
                });
            }
        }
    }
    static index_reset(req, res, next) {
        res.render('reset');
    }
    static async commit_reset(req, res, next) {
        const schema = joi.object({
            username: joi.string().required().email().min(8).max(30).error(new Error('Email không hợp lệ')),
        });
        const result = schema.validate(req.body);
        if (result.error) {
            const errMessage = result.error.message;
            res.json({ message: errMessage });
            return;
        }
        const user = await User_1.User.findOneBy({ email: req.body.username });
        if (user) {
            const randomPassword = crypto.randomBytes(5).toString('hex');
            const messager = sendEmail_1.default.index(user.email, randomPassword);
            const salt = bcrypt.genSaltSync(12);
            user.password = bcrypt.hashSync(randomPassword, salt);
            user.save();
            res.json({ messager, url: "/login" });
        }
        else {
            res.json({ message: 'email không tồn tại' });
        }
    }
}
exports.default = loginController;
