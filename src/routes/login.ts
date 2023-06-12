import { Router } from 'express'
// const express = require('express')
import loginController from '../controllers/loginController'
import checkMiddlerWares from '../middlewares/checkMiddlerWares'
const passport = require('passport')
const router = Router()
require('dotenv').config()

router.get('/', loginController.index)
router.post('/', loginController.commit)

router.get('/register', loginController.index_register)
router.post('/register', loginController.commit_register)

router.get('/reset', checkMiddlerWares.checkIsAdmin, loginController.index_reset)
router.post('/reset', loginController.commit_reset)

export default router
