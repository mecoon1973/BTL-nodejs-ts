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
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;
  
    @Column('nvarchar', { name: 'name_hotel', nullable: false, length: 255 })
    nameHotel: string | null;
  
    @Column('int', { name: 'count_room', nullable: true })
    countRoom: number | null;
  
    @Column('nvarchar', { name: 'image_hotel', nullable: false, length: 255 })
    imageHotel: string | null;
  
    @Column('nvarchar', { name: 'city', nullable: false, length: 255 })
    city: string | null;

    @Column('nvarchar', { name: 'address', nullable: false, length: 255 })
    address: string | null;
  
    @Column('nvarchar', { name: 'type_of', nullable: false, length: 255 })
    typeOf: string | null;
  
    @Column('int', { name: 'money_for_one_night', nullable: true })
    moneyForOneNight: number | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
    createdAt: Date; 
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;
  }
  