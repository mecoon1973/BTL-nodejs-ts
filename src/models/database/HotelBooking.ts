import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class HotelBooking{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userid: number

  @Column()
  roomid: number

  @Column()
  countPerson: number

  @Column()
  countChilden: number

  @Column()
  countRoom: number

  @Column()
  dateBegin: Date

  @Column()
  dateEnd: Date
}
