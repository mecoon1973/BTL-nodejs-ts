import { User } from '../models/database/User'
import MyDataSource from "../utils/myDataSource"
import { Socket } from 'socket.io';
const userRepository = MyDataSource.getRepository(User)
export function socketIoChat(io: any): void {
  io.on('connection', (socket: any) => {
    console.log('nguoi dung da dang nhap : ' + socket.id)
    socket.on('userLogin', async (data: any) => {
      const userLogin = await userRepository.findOneBy({ email: data })
      if (userLogin) {
        userLogin.socketId = socket.id
        userLogin.status = true
        await userRepository.save(userLogin)
        console.log(userLogin)
        if (userLogin.isadmin == 0) {
          const userchat = await userRepository.findOneBy({ status: true, isadmin: 1 })
          if (userchat) {
            socket.emit('userOnline', userchat.socketId)
          }
        }
      }
    })

    socket.on('sendMessage', async (data: any) => {
      io.to(data.socketUser).emit('receiveMessages', {
        message: data.message,
        socketUser: socket.id,
        userName: data.userName
      })
    })



    socket.on('disconnect', async () => {
      const userLogin = await userRepository.findOneBy({ socketId: socket.id })
      if (userLogin) {
        userLogin.socketId = ''
        userLogin.status = false
        await userRepository.save(userLogin)
      }
    })
  })

}

