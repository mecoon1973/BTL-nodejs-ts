import { Request, Response, NextFunction } from 'express';
import service from '~/services/comment.service';
class CommentController {
  async like(req: any, res: Response) {
    const user = req.session.user;
    const id = req.params.id;
    const data = await service.like(id, user.id);
    res.status(200).json(data);
  }
  async unlike(req: any, res: Response) {
    const user = req.session.user;
    const id = req.params.id;
    const data = await service.unlike(id, user.id);
    res.status(200).json(data);
  }
}
export default new CommentController();
// comment