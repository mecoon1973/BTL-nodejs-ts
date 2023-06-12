"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const nodemailer = require('nodemailer');
require('dotenv').config();
class sendEmail {
    static async index(email, password) {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env['MAIL_USERNAME'],
                pass: process.env['MAIL_PASSWORD']
            }
        });
        await transporter.sendMail({
            from: process.env['MAIL_USERNAME'],
            to: `${email}`,
            subject: 'Quên mật khẩu',
            text: password,
            html: `<h2>Mật khẩu mới của bạn là ${password}</h2>`
        }, (err) => {
            if (err) {
                return (0, body_parser_1.json)(err);
            }
            else {
                return { message: 'gửi email thành công' };
            }
        });
    }
}
exports.default = sendEmail;
