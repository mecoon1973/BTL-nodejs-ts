import { PaginationOptions, toPaginateResponse } from 'src/utils/pagination';
import { Repository } from 'typeorm';
import { plainToInstance, plainToClassFromExist } from 'class-transformer';
import MyDataSource from '~/utils/myDataSource';
import { Post } from '~/models/database/Post';

export class PostService {
  // repository : kho luu tru hoat dong gioi han trong mot thuc the co dinh
  public repo: Repository<Post>; //dể lưu trữ kết nối và thao tác với cơ sở dữ liệu
  constructor() {
    this.repo = MyDataSource.getRepository(Post);
    //, vì vậy repository lấy ra sẽ được sử dụng để thao tác với các bản ghi trong bảng tương ứng với entity Post.
  }
  async getMany() {
    return await this.repo.find();
    //k truyen thuoc tinh j trong find mawc dinh la select * from post
  }
  async search(query: PaginationOptions) {
    const limit = query.limit;
    const page = query.page;
    const [posts, total] = await this.repo.findAndCount({
      skip: limit * (page - 1), 
      take: limit,
    });

    return toPaginateResponse<Post>([posts, total], page, limit);
  }
  async getOne(slug: string) {
    const post = await this.repo.findOne({
      where: {
        slug,
      },
      relations: ['author'],
    });
    if (!post) {
      throw new Error('Post not found!');
    }
    return post;
  }
  async getRecommended(option?: { limit?: number; exclude?: number[] }) {
    const qb = this.repo.createQueryBuilder('post');

    if (option?.exclude && option?.exclude?.length > 0) {
      qb.where('post.id NOT IN (:ids)', { ids: option.exclude });
    }
    qb.orderBy('RAND()').take(option?.limit || 5);
    return await qb.getMany();
  }
  async createOne(body: any) {
    const post = plainToInstance(Post, body);
    console.log(post)
    return await this.repo.save(post);
  }
  async updateOne(slug: string, body: any) {
    const post = await this.getOne(slug);
    const updatePost = plainToClassFromExist(post, body);
    return await this.repo.save(updatePost);
  }
  async deleteOne(slug: string) {
    const post = await this.getOne(slug);
    return await this.repo.remove(post);
  }
}

export default new PostService();
