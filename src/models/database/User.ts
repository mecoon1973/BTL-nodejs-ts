import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  socketId: string;

  @Column({ default: false })
  status: boolean;

  @Column({ default: false })
  isadmin: number;

  @OneToMany(() => Post, (entity) => entity.author, { cascade: true })
  posts: Post[];
}
