import { Router } from 'express';
import postController from '../controllers/postAdminController';
import checkMiddlerWares from '../middlewares/checkMiddlerWares';
import { upload } from '../utils/upload';

const router = Router();
require('dotenv').config();

router.get('/', checkMiddlerWares.checkIsAdmin ,postController.getIndexPage);
router.get('/add',checkMiddlerWares.checkIsAdmin, postController.getAddPage);
router.post('/add', upload.single('file'), postController.postAddPage);
router.get('/edit/:slug',checkMiddlerWares.checkIsAdmin, postController.getEditPage);
router.post('/edit/:slug', upload.single('file'), postController.postEditPage);
router.delete('/:slug', checkMiddlerWares.checkIsAdmin, postController.deleteOne);

export default router;
