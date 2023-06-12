import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import service from '~/services/post.service';
class PostAdminController {
  async getIndexPage(req: Request, res: Response) {
    const query = {
      page: Number(req.query['page']) || 1,
      limit: Number(req.query['limit']) || 10,
    };
    const response = await service.search(query);
    const posts = response.data.map((el) => {
      const post = {
        ...el,
        updatedAt: moment(el.updatedAt, 'UTC')
          .tz('Asia/Ho_Chi_Minh')
          .format('YYYY-MM-DD HH:mm:ss'),
        jsonString: JSON.stringify({
          id: el.id,
          slug: el.slug,
        })
      };

      return post;
    });
    const startIndex = (response.page - 1) * response.limit + 1;
    const endIndex =
      response.page >= response.lastPage
        ? response.total
        : response.page * response.limit;
    const pagination = {
      startIndex,
      endIndex,
      total: response.total,
      page: response.page,
      limit: response.limit,
      lastPage: response.lastPage,
      prevPage: response.page - 1,
      nextPage: response.page + 1,
      prevClass: response.page <= 1 ? 'disabled' : '',
      nextClass: response.page >= response.lastPage ? 'disabled' : '',
    };
    res.render('admin/post/index', {
      layout: 'admin',
      posts,
      pagination,
    });
  }
  async getAddPage(req: Request, res: Response) {
    res.render('admin/post/add', { layout: 'admin' });
  }
  async postAddPage(req: Request, res: Response) {
    const file = req.file;
    const body = {
      imageUrl: file?.filename || '',
      ...req.body,
      authorId: 1,
    };
    body.content = body.content.replace(/[\r\n]/g, '');
    await service.createOne(body);
    res.redirect('/admin/post');
  }
  async getEditPage(req: Request, res: Response) {
    const slug = req.params['slug'];
    const post = await service.getOne(slug);
    const statusOption = [
      { value: 1, label: 'Draft', selected: '' },
      { value: 2, label: 'Active', selected: '' },
      { value: 3, label: 'Hide', selected: '' },
    ];
    for (let i = 0; i < statusOption.length; i++) {
      const selected =
        Number(post.status) === Number(statusOption[i].value) ? 'selected' : '';
      statusOption[i].selected = selected;
    }
    res.render('admin/post/edit', {
      layout: 'admin',
      post: { ...post, jsonString: JSON.stringify(post) },
      statusOption,
    });
  }
  async postEditPage(req: Request, res: Response) {
    const slug = req.params['slug'];
    const body = {
      ...req.body,
    };
    if (req.file) {
      const file = req.file;
      body.imageUrl = file?.filename || '';
    }
    body.content = body.content.replace(/[\r\n]/g, '');
    await service.updateOne(slug, body);
    res.redirect('/admin/post');
  }
  async deleteOne(req: Request, res: Response) {
    const slug = req.params['slug'];
    await service.deleteOne(slug);
    res.status(200).json({ message: 'Deleted' });
  }
}
export default new PostAdminController();
