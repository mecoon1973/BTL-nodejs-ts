import { Router } from 'express';
import postController from '../controllers/postAdminController';
import checkMiddlerWares from '../middlewares/checkMiddlerWares';
import { upload } from '../utils/upload';

const router = Router();
require('dotenv').config();

router.get('/', postController.getIndexPage);
router.get('/add', postController.getAddPage);
router.post('/add', upload.single('file'), postController.postAddPage);
router.get('/edit/:slug', postController.getEditPage);
router.post('/edit/:slug', upload.single('file'), postController.postEditPage);
router.delete('/:slug', postController.deleteOne);

export default router;
