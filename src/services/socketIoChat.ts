import { User } from '../models/database/User'
import { Message } from '../models/database/Message'
import MyDataSource from "../utils/myDataSource"
const userRepository = MyDataSource.getRepository(User)
const messageRepository = MyDataSource.getRepository(Message)
export function socketIoChat(io: any): void {
  io.on('connection', (socket: any) => {
    var idUserSend: number
    var idUserReceive: number
    console.log('nguoi dung da dang nhap : ' + socket.id)
    socket.on('userLogin', async (data: any) => {
      const userLogin = await userRepository.findOneBy({ email: data })
      if (userLogin) {
        idUserSend = userLogin.id
        userLogin.socketId = socket.id
        userLogin.status = true
        await userRepository.save(userLogin)
        console.log(userLogin)
        if (userLogin.isadmin == 0) {
          const userchat = await userRepository.findOneBy({ status: true, isadmin: 1 })
          if (userchat) {
            idUserReceive = userchat.id
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

      if (idUserReceive) {
        await messageRepository
          .createQueryBuilder()
          .insert()
          .into(Message)
          .values({
            userSend: idUserSend,
            userReceive: idUserReceive,
            content: data.message,
            idChatHistory: idUserSend,
          })
          .execute()
      } else {
        const userchat = await userRepository.findOneBy({ socketId: data.socketUser })
        if (userchat) {
          await messageRepository
            .createQueryBuilder()
            .insert()
            .into(Message)
            .values({
              userSend: idUserSend,
              userReceive: userchat.id,
              content: data.message,
              idChatHistory: userchat.id,
            })
            .execute()
        }
      }
    })



    socket.on('disconnect', async () => {
      console.log('người dùng đã thoát : ' + socket.id)
      const userLogin = await userRepository.findOneBy({ socketId: socket.id })
      if (userLogin) {
        userLogin.socketId = ''
        userLogin.status = false
        await userRepository.save(userLogin)
      }
    })
  })

}

