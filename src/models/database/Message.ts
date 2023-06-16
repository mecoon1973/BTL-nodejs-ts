import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userSend: Number

  @Column()
  userReceive: Number

  @Column()
  content: string

  @Column()
  idChatHistory: Number
}
