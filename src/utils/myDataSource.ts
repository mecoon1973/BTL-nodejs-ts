import { DataSource } from 'typeorm';
import { User } from '../models/database/User';
import { CommentHotel } from '../models/database/CommentHotel';
import { Message } from '../models/database/Message';
import { Hotel } from '../models/database/Hotel';
import { HotelBooking } from '../models/database/HotelBooking';
import { Post } from '../models/database/Post';
require('dotenv').config();
const port = parseInt(process.env['PORT_DATABASE'] as string, 10);
const myDataSource = new DataSource({
  type: 'mysql',
  host: process.env['HOST'],
  port: port,
  username: process.env['USERNAME_DATABASE'],
  password: process.env['PASSWORD'],
  database: process.env['DATABASE'],
  entities: [User, Message, Hotel, HotelBooking, Post, CommentHotel],
  logging: true,
  synchronize: true,
  subscribers: [],
  migrations: [],
});
export default myDataSource;
