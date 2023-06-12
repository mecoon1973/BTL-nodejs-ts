import { Router } from 'express';
import postController from '../controllers/postController';

const router = Router();
require('dotenv').config();

router.get('/', postController.indexPage);
router.get('/:slug', postController.getOnePage);

export default router;
