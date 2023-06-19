import { Router } from 'express'
import HotelController from '../controllers/hotelController'
import checkMiddlerWares from '../middlewares/checkMiddlerWares'
import hotelController from '../controllers/hotelController'
const router = Router()
require('dotenv').config()

router.get('/', HotelController.topFavorite)

router.get('/detailHotel/like/:id', HotelController.like)

router.get('/detailHotel/unlike/:id', HotelController.unlike)


export default router
