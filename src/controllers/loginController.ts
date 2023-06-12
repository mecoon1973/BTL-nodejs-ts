import { User } from '~/models/database/User'
import sendEmail from '~/utils/sendEmail'
const bcrypt = require('bcrypt')
const passport = require('passport')
const crypto = require('crypto')
const joi = require('joi')
import MyDataSource from "~/utils/myDataSource"

const userRepository = MyDataSource.getRepository(User)
class loginController {

    public static index(req: any, res: any, next: any) {

        res.render('singnup')
    }

    public static commit(req: any, res: any, next: any) {
        passport.authenticate('local', (err: any, user: any, info: any) => {
            if (err || !user) {
                const message = info ? info.message : 'Đăng nhập thất bại'
                res.json({ message: message })
                return
            }

            // Đăng nhập thành công
            req.login(user, () => {

                req.session.user = user
                if (user.isadmin == 1) {
                    res.json({
                        url: '/admin/post'
                    })
                } else {
                    res.json({
                        url: '/'
                    })
                }
            });
        })(req, res, next);


    }

    public static index_register(req: any, res: any) {
        res.render('register')
    }

    public static async commit_register(req: any, res: any) {
        const schema = joi.object({
            name: joi.string().required().max(30).error(new Error('Tên không hợp lệ')),
            username: joi.string().required().email().min(8).max(30).error(new Error('Email không hợp lệ')),
            password: joi.string().required().min(8).max(30).error(new Error('Password không hợp lệ')),
            passwordAgain: joi.string().required().min(8).max(30).error(new Error('passwordAgain không hợp lệ'))
        })
        const result = schema.validate(req.body)
        if (result.error) {
            const errMessage = result.error.message
            res.json({ message: errMessage })
            return
        }

        const user = await userRepository.findOneBy({ email: req.body.username })
        if (user) {
            res.json({ message: 'email đã tồn tại' })
        } else {
            const password = req.body.password
            const passwordAgain = req.body.passwordAgain
            if (password != passwordAgain) {
                res.json({ message: 'Password sai! vui lòng nhập lại' })
            } else {
                const salt = bcrypt.genSaltSync(12)
                const passwordUser = bcrypt.hashSync(req.body.password, salt)
                const userNew: User = new User()
                userNew.name = req.body.name
                userNew.email = req.body.username
                userNew.password = passwordUser
                await userRepository.save(userNew)
                res.json({
                    url: '/'
                })
            }
        }
    }

    public static index_reset(req: any, res: any, next: any) {
        res.render('reset')
    }

    public static async commit_reset(req: any, res: any, next: any) {
        const schema = joi.object({
            username: joi.string().required().email().min(8).max(30).error(new Error('Email không hợp lệ')),
        })
        const result = schema.validate(req.body)
        if (result.error) {
            const errMessage = result.error.message
            res.json({ message: errMessage })
            return
        }

        const user = await userRepository.findOneBy({ email: req.body.username })
        if (user) {
            const randomPassword = crypto.randomBytes(5).toString('hex');
            const messager = sendEmail.index(user.email, randomPassword)
            const salt = bcrypt.genSaltSync(12)
            user.password = bcrypt.hashSync(randomPassword, salt)
            await userRepository.save(user)
            res.json({ messager, url: "/login" })
        } else {
            res.json({ message: 'email không tồn tại' })
        }
    }

}
export default loginController