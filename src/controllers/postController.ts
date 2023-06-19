import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import service from '~/services/post.service';
import { ICreateCommentDto } from '~/interfaces/comment';
import commentService from '~/services/comment.service';
import { generatePreview } from '~/utils/common';
import { timeSince } from '~/utils/hbs.helper';

class PostController {
  constructor() {}
  
  private formatComment(cm: any) {
    if (cm.children) cm = commentService.toResponseObject(cm);
    
    if (cm.isIncognito) {
      cm.user = {
        userName: cm.anonymousAuthor.userName,
        email: cm.anonymousAuthor.email,
      };
      delete cm.anonymousAuthor;
      delete cm.author;
    } else {
      cm.user = {
        userName: cm.author.name,
        email: cm.author.email,
      };
      delete cm.anonymousAuthor;
      delete cm.author;
    }
    moment
      .utc(cm.createdAt)
      .tz('Asia/Ho_Chi_Minh')
      .format('YYYY-MM-DD HH:mm:ss');
    cm.timeSince = timeSince(cm.createdAt, {
      currentDate: moment.utc().tz('Asia/Ho_Chi_Minh').toDate(),
    });
  }
  public async indexPage(req: any, res: any, next: any) {
    const posts = await service.getMany();
    posts.forEach((el) => {
      el.content = generatePreview(el.content || '', 200);
    });
    res.render('blog', {
      posts,
    });
  }

  public async getOnePage(req: any, res: any, next: any) {
    const slug = req.params.slug;
    try {
      const user = req.session.user;
      const post = await service.getOne(slug);
      const recommended = await service.getRecommended({
        limit: 5,
        exclude: [post.id],
      });
    
      let comments: any[] = await commentService.getManyByPost(post.id);
      comments = comments.map((comment) => {
        const cm: any = { ...comment };
        this.formatComment(cm);
        if (cm.children && cm.children.length > 0) {
          cm.children.forEach((el: any) => {
            this.formatComment(el);
          });
        }
        cm.jsonString = JSON.stringify(cm);
        return cm;
      });
      const commentToken = req.cookies?.commentToken;
      const isShowGetInfo = user ? false : commentToken ? false : true;
    
      res.render('single', {
        post,
        recommended,
        comments,
        isShowGetInfo
      });
    } catch (e: any) {
      res.status(400).json({ success: false, status: 400, message: e.message });
    }
  }

  public async commentAdd(req: any, res: Response) {
    const user = req.session.user;
    const commentToken = req.cookies?.commentToken;
    const postSlug = req.params.slug;
    const body: ICreateCommentDto = {
      content: req.body.content,
      postSlug,
      userName: req.body.userName,
      email: req.body.email,
      authorId: 0,
      isIncognito: 0,
      parentId: req.body.parentId,
    };
   
    if (user) {
      body.isIncognito = 0;
      body.userName = undefined;
      body.email = undefined;
      body.authorId = user.id;
      body.token = undefined;
    
    } else if (commentToken || body.email) {
      body.isIncognito = 1;
      if (commentToken) {
        body.email = undefined; 
        body.token = commentToken; 
       
      }
    }
    const data = await commentService.createOne(body);
    if (data.hash) {
      res.cookie('commentToken', data.hash, {
        expires: new Date(Date.now() + 86400 * 1000),
        httpOnly: true,
      });
    }
    res.redirect(`/post/${postSlug}`);
  }
}
export default new PostController();
