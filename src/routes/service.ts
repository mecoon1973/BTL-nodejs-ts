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
router.post('/bookingHotels', checkMiddlerWares.checkLoginJson, serviceController.booking_hotels)

router.post('/findHotel', serviceController.findHotel)

router.post('/findhotelcost', serviceController.findHotelCost)

export default router
