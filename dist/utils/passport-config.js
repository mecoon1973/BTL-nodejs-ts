"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User_1 = require("../models/database/User");
const joi = require('joi');
/// Định nghĩa chiến lược xác thực
function initialize(passport) {
    passport.use(new LocalStrategy(async (username, password, cb) => {
        try {
            const schema = joi.object({
                username: joi.string().required().email().min(8).max(30).error(new Error('Email không hợp lệ')),
                password: joi.string().required().min(8).max(30).error(new Error('Password không hợp lệ')),
            });
            const result = schema.validate({ username, password });
            if (result.error) {
                const errMessage = result.error.message;
                return cb(null, false, { message: errMessage });
            }
            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User_1.User.findOneBy({ email: username });
            // Kiểm tra xem người dùng có tồn tại không
            if (!user) {
                return cb(null, false, { message: 'Người dùng không tồn tại.' });
            }
            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return cb(null, user);
            }
            else {
                return cb(null, false, { message: 'Sai mật khẩu.' });
            }
        }
        catch (err) {
            return cb(err);
        }
    }));
    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });
    passport.deserializeUser(async function (idUser, cb) {
        const user = await User_1.User.findOneBy({ id: idUser });
        if (user) {
            return cb(null, user);
        }
        return cb(null, false);
    });
}
exports.initialize = initialize;
// Đoạn mã trên định nghĩa hai hàm serializeUser và deserializeUser để Passport có thể lưu trữ thông tin người dùng trong phiên.
// Hàm serializeUser được gọi khi người dùng đăng nhập thành công và thông tin
// người dùng cần được lưu trữ trong phiên. Hàm này nhận vào một đối tượng người dùng và một hàm callback
// để trả về thông tin người dùng cần được lưu trữ trong phiên. Trong ví dụ trên, hàm callback trả về một
// đối tượng với hai thuộc tính id và username của người dùng.
// Hàm deserializeUser được gọi khi Passport cần truy cập thông tin người dùng trong phiên.
// Hàm này nhận vào thông tin người dùng được lưu trữ trong phiên và một hàm callback để trả về đối tượng người dùng.
// Trong ví dụ trên, hàm callback trả về đối tượng người dùng trực tiếp.
// Trong cả hai hàm, chúng ta sử dụng hàm process.nextTick
// để đảm bảo rằng chúng được thực thi sau khi hàm gọi trước đó đã hoàn thành.
// Điều này giúp đảm bảo rằng các hàm này sẽ được gọi đồng bộ trong quá trình xử lý yêu cầu của ứng dụng.
