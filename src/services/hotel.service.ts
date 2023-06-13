import { PaginationOptions, toPaginateResponse } from 'src/utils/pagination';
import { Repository } from 'typeorm';
import { plainToInstance, plainToClassFromExist } from 'class-transformer';
import MyDataSource from '~/utils/myDataSource';
import { Hotel } from '~/models/database/Hotel';

export class HotelService {
    // repository : kho luu tru hoat dong gioi han trong mot thuc the co dinh
    public repo: Repository<Hotel>; //dể lưu trữ kết nối và thao tác với cơ sở dữ liệu
    constructor() {
    this.repo = MyDataSource.getRepository(Hotel);
    //, vì vậy repository lấy ra sẽ được sử dụng để thao tác với các bản ghi trong bảng tương ứng với entity Post.
    }

    async getMany() {
        return await this.repo.find();
        //k truyen thuoc tinh j trong find mawc dinh la select * from hotel
      }
      async search(query: PaginationOptions) {
        const limit = query.limit;
        const page = query.page;
        const [hotels, total] = await this.repo.findAndCount({
          skip: limit * (page - 1), 
          take: limit,
        });
        return toPaginateResponse<Hotel>([hotels, total], page, limit);
      }
      async getOne(id: number) {
        const hotel = await this.repo.findOne({
          where: {
            id,
          },
          relations: ['author'],
        });
        if (!hotel) {
          throw new Error('Hotel not found!');
        }
        return hotel;
      }
      async createOne(body: any) {
        const hotel = plainToInstance(Hotel, body);
        console.log(hotel)
        return await this.repo.save(hotel);
      }


      async updateOne(id: number, body: any) {
        const hotel = await this.getOne(id);
        const updateHotel = plainToClassFromExist(hotel, body);
        return await this.repo.save(updateHotel);
      }
      async deleteOne(id: number) {
        const hotel = await this.getOne(id);
        return await this.repo.remove(hotel);
      }
}

export default new HotelService();
