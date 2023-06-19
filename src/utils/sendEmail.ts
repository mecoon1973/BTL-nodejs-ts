import { json } from 'body-parser';
import { Message } from '~/models/database/Message';
const nodemailer = require('nodemailer');
require('dotenv').config();
class sendEmail {
  static async index(email: string, password: string) {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env['MAIL_USERNAME'],
        pass: process.env['MAIL_PASSWORD'],
      },
    });

    await transporter.sendMail(
      {
        from: process.env['MAIL_USERNAME'],
        to: `${email}`,
        subject: 'Quên mật khẩu',
        text: password,
        html: `<h2>Mật khẩu mới của bạn là ${password}</h2>`,
      },
      (err: any) => {
        if (err) {
          return json(err);
        } else {
          return { message: 'gửi email thành công' };
        }
      }
    );
  }
  static async newComment(email: string, who: string) {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env['MAIL_USERNAME'],
        pass: process.env['MAIL_PASSWORD'],
      },
    });

    await transporter.sendMail(
      {
        from: process.env['MAIL_USERNAME'],
        to: `${email}`,
        subject: 'Thông báo trả lời comment',
        text: who,

        html: `<h2>${who} đã trả lời comment của bạn.</h2>`,
      },
      (err: any) => {
        if (err) {
          return json(err);
        } else {
          return { message: 'gửi email thành công' };
        }
      }
    );
  }
}
export default sendEmail;
