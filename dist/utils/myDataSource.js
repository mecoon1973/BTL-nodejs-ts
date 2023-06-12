"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../models/database/User");
const Message_1 = require("../models/database/Message");
require('dotenv').config();
const port = parseInt(process.env['PORT_DATABASE'], 10);
const myDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env['HOST'],
    port: port,
    // username: 'root',
    username: process.env['USERNAME_DATABASE'],
    password: process.env['PASSWORD'],
    database: process.env['DATABASE'],
    entities: [User_1.User, Message_1.Message],
    logging: true,
    synchronize: true
});
exports.default = myDataSource;
