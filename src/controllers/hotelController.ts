import { Request, Response, NextFunction } from 'express';
import service from '~/services/hotel.service';

class HotelController{
    async topFavorite(req: Request, res: Response) {
        try {
            const hotels = await service.repo
            .createQueryBuilder('hotel')
            .where('hotel.like >= :like', { like: 1 }) 
            .getMany();
          const top = await service.getMany(); 
          const sortedHotels = top.sort((a, b) => b.like - a.like);
          const favoriteHotels = sortedHotels.slice(0, 3); 
          res.render('favoriteHotel', { layout: '', hotels, top: favoriteHotels }); 
        } catch (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
    }
    
    async like(req: Request, res: Response) {
      try {
        const id = req.params['id'];
        const hotel = await service.getOne(parseInt(id))
        hotel.like++;
        await service.update(parseInt(id), hotel)
        res.render('detailHotel', { hotel, layout:'' });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } 
    }
    async unlike(req: Request, res: Response) {
      try {
        const id = req.params['id'];
        const hotel = await service.getOne(parseInt(id))
        hotel.like--;
        await service.update(parseInt(id), hotel)
        res.render('detailHotel', { hotel, layout:'' });
      } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } 
    }
} 

export default new HotelController();
