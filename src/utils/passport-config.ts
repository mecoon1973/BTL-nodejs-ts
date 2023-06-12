const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
import { User } from '../models/database/User'
const joi = require('joi')
import  MyDataSource  from "~/utils/myDataSource"

const userRepository = MyDataSource.getRepository(User)
/// Định nghĩa chiến lược xác thực
export function initialize(passport: any) {
  passport.use(
    new LocalStrategy(async (username: string, password: string, cb: any) => {
      try {
        const schema = joi.object({
          username: joi.string().required().email().min(8).max(30).error(new Error('Email không hợp lệ')),
          password: joi.string().required().min(8).max(30).error(new Error('Password không hợp lệ')),
        })
        const result = schema.validate({ username, password })
        if (result.error) {
          const errMessage = result.error.message
          return cb(null, false, { message: errMessage })
        }
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await userRepository.findOneBy({ email: username })

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
          return cb(null, false, { message: 'Người dùng không tồn tại.' })
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
          return cb(null, user)
        } else {
          return cb(null, false, { message: 'Sai mật khẩu.' })
        }
      } catch (err) {
        return cb(err)
      }
    })
  )
  passport.serializeUser(function (user: User, cb: any) {
    cb(null, user.id)
  })

  passport.deserializeUser(async function (idUser: any, cb: any) {
    const user =  await userRepository.findOneBy({ id: idUser })
    if (user) {
      return cb(null, user)
    }
    return cb(null, false)

  })
}

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
