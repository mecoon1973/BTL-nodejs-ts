import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Comment } from './Comment';

@Entity('anonymous_user')
@Index(['email'], { unique: true })
export class AnonymousUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('nvarchar', { name: 'user_name', nullable: false, length: 255 })
  userName: string;

  @Column('nvarchar', { name: 'email', nullable: false, length: 255 })
  email: string;

  @Column('varchar', { name: 'hash', nullable: false, length: 255 })
  hash: string;
  //mk dc ma hoa nguoi dung an danh

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Comment, (entity) => entity.anonymousAuthor, {
    onDelete: 'CASCADE',
   
  })
  comments: Comment[];
}
