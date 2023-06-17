import { Hotel } from "~/models/database/Hotel"
import { Message } from "~/models/database/Message"
import { HotelBooking } from "~/models/database/HotelBooking"
import { User } from "~/models/database/User"
import MyDataSource from "~/utils/myDataSource"

import { Request, Response, NextFunction } from 'express';
import service from '~/services/hotel.service';

const hotelRepository = MyDataSource.getRepository(Hotel)
const hotelBookingRepository = MyDataSource.getRepository(HotelBooking)
const messageRepository = MyDataSource.getRepository(Message)
class serviceController {
    public static async index(req: any, res: any, next: any) {
        const user = req.session.user
        if (user) {
            res.render('service', { user: user })
        }
        res.render('service')
    }
    public static async indexChat(req: any, res: any, next: any) {
        const user = req.session.user
        if (user) {
            res.render('chat', { user: user })
        }
        res.render('chat')
    }
    public static async indexChatAdmin(req: any, res: any, next: any) {
        const user = req.session.user
        if (user) {
            res.render('chatAdmin', { user: user, layout: 'admin' })
        }
        res.render('chatAdmin')
    }

    public static async service(req: any, res: any, next: any) {
        const user = req.session.user
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
        if (user) {
            res.render('Listhotel', {
                city: city,
                listHotel: listAddressHotel,
                countPerson: countPerson,
                countChilden: countChilden,
                countRoom: countRoom,
                dateBegin: dateBegin,
                dateEnd: dateEnd,
                user: user
            })
        } else {
            res.render('Listhotel', {
                city: city,
                listHotel: listAddressHotel,
                countPerson: countPerson,
                countChilden: countChilden,
                countRoom: countRoom,
                dateBegin: dateBegin,
                dateEnd: dateEnd,
            })
        }

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
            res.json({ hotel: listAddressHotel })
        }
    }

    public static commit_service(req: any, res: any, next: any) {

    }

    public static async booking_hotels(req: any, res: any, next: any) {
        const id = req.params['id']
        const countPerson = req.query.countPerson
        const countChilden = req.query.countChilden
        const countRoom = req.query.countRoom
        const dateBegin = req.query.dateBegin
        const dateEnd = req.query.dateEnd
        const kindOfRoom = req.body.kindOfRoom
        const user = req.session.user
        await hotelBookingRepository
            .createQueryBuilder('hotel')
            .insert()
            .into(HotelBooking)
            .values({
                userid: user.id,
                roomid: id,
                countPerson: countPerson,
                countChilden: countChilden,
                countRoom: countRoom,
                dateBegin: dateBegin,
                dateEnd: dateEnd,
                kindOfRoom: kindOfRoom,
            })
            .execute()
        res.json({ check: true })
    }

    public static async detailHotel(req: any, res: any) {
        try {
            const id = req.params['id'];
            const hotel = await service.getOne(parseInt(id));
            res.render('detailHotel', { hotel, layout: '' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
    public static async chatUser(req: any, res: any) {
        const user = req.session.user
        if (user) {
            const dataMessage = await messageRepository.createQueryBuilder()
                .select()
                .where("message.idChatHistory = :idChatHistory", { idChatHistory: user.id })
                .getMany()
            if (dataMessage)
                res.json({ check: true, dataMessage: dataMessage, user: user })
            else
                res.json({ check: false })
        }
        else {
            res.json({ check: false })
        }
    }

    public static async checkUserWithRoom(req: any, res: any) {
        const user = req.session.user
        const roomId = req.body.idRoom
        if (user) {
            const historyRoom = await hotelBookingRepository
                .createQueryBuilder()
                .where({ userid: user.id, roomid: roomId })
                .getMany()
            if (historyRoom.length > 0) {
                res.json({ check: true, historyRoom })
                return
            }else{
                res.json({ check: false })
                return
            }
        }
        res.json({ check: false })
    }
}
export default serviceController
