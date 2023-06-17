import { Router } from 'express'
import serviceController from '../controllers/serviceController'
import checkMiddlerWares from '../middlewares/checkMiddlerWares'
const router = Router()
require('dotenv').config()

router.get('/', serviceController.index)
// router.get('/listHotel',  serviceController.Listhotel)
router.get('/searchHotel', serviceController.service)

router.get('/chat', serviceController.indexChat)

router.get('/chatadmin', serviceController.indexChatAdmin)

router.get('/hotel', serviceController.service)

router.post('/findHotel', serviceController.findHotel)
router.post('/chatUser', serviceController.chatUser)

router.post('/findhotelcost', serviceController.findHotelCost)

router.get('/detailHotel/:id',  serviceController.detailHotel)
// router.post('/detailHotel/:id',  serviceController.booking_hotels)
router.post('/detailHotel/:id', checkMiddlerWares.checkLoginJson,  serviceController.booking_hotels)

router.post('/checkUserWithRoom',  serviceController.checkUserWithRoom)

export default router
