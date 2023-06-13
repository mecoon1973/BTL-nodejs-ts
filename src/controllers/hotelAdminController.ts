import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import service from '~/services/hotel.service';

class HotelAdminController{
    async getIndexPage(req: Request, res: Response) {
        const query = {
          page: Number(req.query['page']) || 1,
          limit: Number(req.query['limit']) || 10,
        };
        const response = await service.search(query);
        const hotels = response.data.map((el) => {
          const hotel = {
            ...el,
            updatedAt: moment(el.updatedAt, 'UTC')
              .tz('Asia/Ho_Chi_Minh')
              .format('YYYY-MM-DD HH:mm:ss'),
          };
          return hotel;
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
        res.render('admin/hotel/index', {
          layout: 'admin',
          hotels,
          pagination,
        });  
      }
      async getAddPage(req: Request, res: Response) {
        res.render('admin/hotel/add', { layout: 'admin' });
      }
      async hotelAddPage(req: Request, res: Response) {
        const file = req.file;
        const body = {
          imageHotel: file?.filename || '',
          ...req.body,
          authorId: 1, 
        };
        await service.createOne(body);
        res.redirect('/admin/hotel');
      }

      async getEditPage(req: Request, res: Response) {
        const id = req.params['id'];
        const hotel = await service.getOne(parseInt(id));
        
        res.render('admin/hotel/edit', {
          layout: 'admin',
          hotel: hotel
        });
      }
      async hotelEditPage(req: Request, res: Response) {
        const id = req.params['id'];
        const body = {
          ...req.body,
        };
        if (req.file) {
          const file = req.file;
          body.imageUrl = file?.filename || '';
        }
        await service.updateOne(parseInt(id), body);
        res.redirect('/admin/hotel');
      }
      async deleteOne(req: Request, res: Response) {
        const id = req.params['id'];
        await service.deleteOne(parseInt(id));
        res.status(200).json({ message: 'Deleted' });
      }
} 

export default new HotelAdminController();
