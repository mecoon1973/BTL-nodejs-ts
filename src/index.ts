import express from 'express'
import route from './routes/index'
import myDataSource from './utils/myDataSource'
const app = require('express')()
const path = require('path')
const handlebars = require('express-handlebars')
const hand = require('handlebars')
const morgan = require('morgan')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
// const cookieParser = require('cookie-parser ')
const layouts = require('handlebars-layouts')
import { initialize } from './utils/passport-config'
require('dotenv').config()
import { socketIoChat } from './services/socketIoChat'
import { Socket } from 'socket.io'

const { Server } = require("socket.io");
const http = require('http')
const server = http.createServer(app)
const io = new Server(server)

socketIoChat(io)

//Template engine
app.engine(
    '.hbs',
    handlebars.engine({
        extname: '.hbs',
    })
)
hand.registerHelper(layouts(hand))
app.set('view engine', '.hbs')
app.set('views', path.join(path.resolve('src/resources'), 'views'))
app.use(express.static(path.resolve("src/public")));


//HTTP logger
app.use(morgan('combined'))

//khai báo để sử dụng khi lấy dữ liệu từ post lên nó sẽ lưu vào body
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

myDataSource
    .initialize()
    .then(() => {
        console.log('thành công!')
    })
    .catch((err: any) => {
        console.error('Error during Data Source initialization:', err)
    })

app.use(
    session({
        secret: process.env['SECRET_KEY_SESSION'], // Chuỗi bí mật này được sử dụng để mã hóa cookie
        resave: false, // Lưu lại session mỗi khi request
        saveUninitialized: false, // Lưu session mới nếu chưa có
    })
)
app.use(passport.initialize())
app.use(passport.authenticate('session'))
app.use(passport.session())
app.use(flash())

initialize(passport)


//route init
route(app)
if (!process.env['PORT']) {
    process.exit(1)
}

const PORT: number = parseInt(process.env['PORT'] as string, 10)
// app.listen(PORT, () => {
//     console.log(`[Server]: I am running at http://localhost:${PORT}`)
// })
server.listen(PORT)
