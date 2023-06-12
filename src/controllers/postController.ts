import service from '~/services/post.service';
import { generatePreview } from '~/utils/common';
class postController {
  public static async indexPage(req: any, res: any, next: any) {
    const posts = await service.getMany();
    posts.forEach((el) => {
      el.content = generatePreview(el.content || '', 200);
    });
    res.render('blog', {
      posts,
    });
  }

  public static async getOnePage(req: any, res: any, next: any) {
    const slug = req.params.slug;
    try {
      const post = await service.getOne(slug);
      const recommended = await service.getRecommended({
        limit: 5,
        exclude: [post.id],
      });
      console.log(recommended);
      res.render('single', {
        post,
        recommended,
      });
    } catch (e: any) {
      res.status(400).json({ success: false, status: 400, message: e.message });
    }
  }

  public static list_hotel(req: any, res: any, next: any) {
    res.render('Listhotel');
  }
}
export default postController;
