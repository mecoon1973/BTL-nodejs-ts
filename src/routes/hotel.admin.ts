import { Router } from 'express';
import hotelController from '../controllers/hotelAdminController';
import checkMiddlerWares from '../middlewares/checkMiddlerWares';
import { upload } from '../utils/upload';

const router = Router();
require('dotenv').config();

router.get('/', hotelController.getIndexPage);
router.get('/add', hotelController.getAddPage);
router.post('/add', upload.single('file'), hotelController.hotelAddPage);
router.get('/edit/:id', hotelController.getEditPage);
router.post('/edit/:id', upload.single('file'), hotelController.hotelEditPage);
router.delete('/:id', hotelController.deleteOne);

export default router;
