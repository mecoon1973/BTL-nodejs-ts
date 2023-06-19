import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('hotel')
//   @Index(['slug'], { unique: true })
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nameHotel: string

  @Column()
  countRoom: number

  @Column()
  vipRoom: number

  @Column()
  like: number
  
  @Column()
  imgHotel: string

  @Column()
  city: string

  @Column()
  Address: string

  @Column()
  typeOf: string

  @Column()
  moneyForOneNight: number

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'author_id' })
  // author: User;
}
