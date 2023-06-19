import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
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

  @OneToMany(() => Comment, (entity) => entity.author, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
