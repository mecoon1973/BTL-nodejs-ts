import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { EPostStatus } from '~/enums/post.enum';
import { Comment } from './Comment';

@Entity('post')
@Index(['slug'], { unique: true })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'title', nullable: false })
  title: string;

  @Column('nvarchar', { name: 'slug', nullable: false, length: 255 })
  slug: string;

  @Column('text', { name: 'meta_title', nullable: true })
  metaTitle: string | null;

  @Column('text', { name: 'content', nullable: true })
  content: string | null;

  @Column('nvarchar', { name: 'image_url', nullable: true, length: 255 })
  imageUrl: string | null;

  @Column('tinyint', { name: 'status', width: 1, default: EPostStatus.ACTIVE })
  status: number;

  @Column('int', { name: 'author_id', nullable: false })
  authorId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany((type) => Comment, (comment) => comment.post, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
