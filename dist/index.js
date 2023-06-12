"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const myDataSource_1 = __importDefault(require("./utils/myDataSource"));
const app = require('express')();
const path = require('path');
const handlebars = require('express-handlebars');
const hand = require('handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
// const cookieParser = require('cookie-parser ')
const layouts = require('handlebars-layouts');
const passport_config_1 = require("./utils/passport-config");
require('dotenv').config();
//Template engine
app.engine('.hbs', handlebars.engine({
    extname: '.hbs',
}));
hand.registerHelper(layouts(hand));
app.set('view engine', '.hbs');
// app.set('views', path.join('D:\\BTL_NODEJS\\src\\resources\\views'))
app.set('views', path.join(path.resolve('src/resources'), 'views'));
app.use(express_1.default.static(path.resolve("src/public")));
// console.log(global._io)
//HTTP logger
app.use(morgan('combined'));
//khai báo để sử dụng khi lấy dữ liệu từ post lên nó sẽ lưu vào body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
myDataSource_1.default
    .initialize()
    .then(() => {
    console.log('thành công!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
app.use(session({
    secret: process.env['SECRET_KEY_SESSION'],
    resave: false,
    saveUninitialized: false, // Lưu session mới nếu chưa có
}));
app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use(passport.session());
app.use(flash());
(0, passport_config_1.initialize)(passport);
//route init
(0, index_1.default)(app);
if (!process.env['PORT']) {
    process.exit(1);
}
const PORT = parseInt(process.env['PORT'], 10);
app.listen(PORT, () => {
    console.log(`[Server]: I am running at http://localhost:${3000}`);
});
