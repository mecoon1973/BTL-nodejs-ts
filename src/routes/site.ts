import { Router } from 'express'
import siteController from '../controllers/siteController'
const router = Router()
require('dotenv').config()

router.get('/', siteController.index)


export default router
