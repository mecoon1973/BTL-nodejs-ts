import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class CommentHotel{
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userid: number

  @Column()
  roomid: number

  @Column()
  content: String
}
