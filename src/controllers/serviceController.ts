import { Hotel } from "~/models/database/Hotel"
import { HotelBooking } from "~/models/database/HotelBooking"
import { User } from "~/models/database/User"
import MyDataSource from "~/utils/myDataSource"
import { Message } from '../models/database/Message';

const hotelRepository = MyDataSource.getRepository(Hotel)
const hotelBookingRepository = MyDataSource.getRepository(HotelBooking)
class serviceController {
    public static async index(req: any, res: any, next: any) {
        const user = req.session.user
        if (user) {
            res.render('service', { user: user })
            return
        }
        res.render('service')
    }
    public static async indexChat(req: any, res: any, next: any) {
        const user = req.session.user
        if (user) {
            res.render('chat', { user: user })
            return
        }
        res.render('chat')
    }
    public static async indexChatAdmin(req: any, res: any, next: any) {
        const user = req.session.user
        if (user) {
            res.render('chatAdmin', { user: user })
            return
        }
        res.render('chatAdmin')
    }

    public static async service(req: any, res: any, next: any) {
        const city = req.query.city
        const countPerson = req.query.countPerson
        const countChilden = req.query.countChilden
        const countRoom = req.query.countRoom
        const dateBegin = req.query.dateBegin
        const dateEnd = req.query.dateEnd
        const listAddressHotel = await hotelRepository
            .createQueryBuilder('hotel')
            .where('hotel.city = :city', { city: city })
            .getMany();

        res.render('Listhotel', {
            city: city,
            listHotel: listAddressHotel,
            countPerson: countPerson,
            countChilden: countChilden,
            countRoom: countRoom,
            dateBegin: dateBegin,
            dateEnd: dateEnd
        })

    }

    public static async findHotel(req: any, res: any, next: any) {
        const city = req.body.city
        const listAddressHotel = await hotelRepository
            .createQueryBuilder('hotel')
            .where('hotel.city = :city', { city: city })
            .getMany();
        if (listAddressHotel.length == 0) {
            res.json({ message: 'không tìm thấy khách sạn ở địa điểm này' })
        } else {
            res.json()
        }
    }

    public static async findHotelCost(req: any, res: any, next: any) {
        const city = req.body.city
        const valMin = req.body.valMin
        const valMax = req.body.valMax
        const listAddressHotel = await hotelRepository
        .createQueryBuilder('hotel')
        .where('hotel.city = :city', { city: city })
        .andWhere('hotel.moneyForOneNight > :valMin', { valMin: valMin })
        .andWhere('hotel.moneyForOneNight < :valMax', { valMax: valMax })
        .getMany();
        if (listAddressHotel.length == 0) {
            res.json({ message: 'không tìm thấy khách sạn ở địa điểm này' })
        } else {
            res.json({hotel :listAddressHotel })
        }
    }

    public static commit_service(req: any, res: any, next: any) {

    }

    public static async booking_hotels(req: any, res: any, next: any) {
        const idRoom = req.body.idRoom
        const countPerson = req.body.countPerson
        const countChilden = req.body.countChilden
        const countRoom = req.body.countRoom
        const dateBegin = req.body.dateBegin
        const dateEnd = req.body.dateEnd
        const user = req.session.user
        await hotelBookingRepository
            .createQueryBuilder('hotel')
            .insert()
            .into(HotelBooking)
            .values({
                userid: user.id,
                roomid: idRoom,
                countPerson: countPerson,
                countChilden: countChilden,
                countRoom: countRoom,
                dateBegin: dateBegin,
                dateEnd: dateEnd,
            })
            .execute()
        res.json({ url: '/' })
    }

    public static list_hotel(req: any, res: any, next: any) {
        res.render('Listhotel')
    }
}
export default serviceController
