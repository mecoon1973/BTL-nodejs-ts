import { Router } from 'express';
import commentController from '../controllers/commentController';
import checkMiddlerWares from '../middlewares/checkMiddlerWares';
const router = Router();
require('dotenv').config();

router.post('/:id/like', checkMiddlerWares.checkLogin, commentController.like);
router.post(
  '/:id/unlike',
  checkMiddlerWares.checkLogin,
  commentController.unlike
);

export default router;
