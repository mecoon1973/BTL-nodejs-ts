import loginController from '~/controllers/loginController'
import siteRouter from './site'
import loginRouter from './login'
import serviceRouter from './service'
import hotelRouter from './hotel'
import postRouter from './post';
import adminPostRouter from './post.admin';
import adminHotelRouter from './hotel.admin';
import errorHandler from '../middlewares/404.mindleware';

function route(app: any) { 
  app.use('/login', loginRouter)
  app.use('/service', serviceRouter)
  app.use('/favoriteHotel', hotelRouter)
  app.use('/', siteRouter)
  app.use('/post', postRouter);
  app.use('/admin/post', adminPostRouter);
  app.use('/admin/hotel', adminHotelRouter);
  app.use(errorHandler);
}

export default route
