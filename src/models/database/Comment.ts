import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';
import { AnonymousUser } from './AnonymousUser';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content', nullable: false })
  content: string;

  @Column('int', { name: 'author_id', nullable: true })
  authorId: number | null;

  @Column('int', { name: 'anonymous_author_id', nullable: true })
  anonymousAuthorId: number | null;

  @Column('tinyint', { name: 'is_incognito', width: 1, default: 0 })
  isIncognito: number;
  //trạng thái ẩn danh của bình luận, được định dạng dưới dạng số nguyên (0 hoặc 1)

  @Column('int', { name: 'post_id', nullable: false })
  postId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'author_id' })
  author: User | null;
  // Cụ thể là cột author_id trong Entity Comment sẽ được liên kết với cột id trong Entity User.
  // thuộc tính author : đại dien cho user liên quan đến comment
  //Trong trường hợp không có User liên quan đến Comment hiện tại (ví dụ như khi Comment được tạo bởi một User ẩn danh), thuộc tính author sẽ có giá trị null.



  @ManyToOne(() => AnonymousUser, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'anonymous_author_id' })
  anonymousAuthor: AnonymousUser | null;

  @ManyToOne(() => Post, {
    cascade: true,
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;
 // được sử dụng để định nghĩa một mối quan hệ Many-to-One giữa Entity Comment và chính nó, để tạo ra một mối quan hệ cha con giữa các Comment. Nghĩa là mỗi Comment chỉ có thể có một Comment cha, nhưng một Comment cha có thể có nhiều Comment con.*/
  @ManyToOne((type) => Comment, (comment) => comment.children)
  parent: Comment;

  @OneToMany((type) => Comment, (comment) => comment.parent)
  children: Comment[];
  /* được sử dụng để định nghĩa một mối quan hệ One-to-Many giữa Entity Comment và chính nó, để tạo ra một mối quan hệ cha con giữa các Comment. Nghĩa là mỗi Comment cha chỉ có thể có nhiều Comment con, nhưng mỗi Comment con chỉ có thể thuộc về một Comment cha.*/
  @ManyToMany((type) => User, { cascade: true })
  //Nghĩa là mỗi Post có thể có nhiều User yêu thích, và mỗi User có thể yêu thích nhiều Post.
  @JoinTable({
    // tao ra bang trung gian Entity Comment và Entity User, để lưu trữ các thông tin về User đã thích Comment nào.
    name: 'comment_like',
    joinColumn: {
      //joinColumn: một đối tượng cấu hình cho biết tên cột trong bảng trung gian tương ứng với khóa ngoại của Entity hiện tại. Trong trường hợp này, tên cột là comment_id.
      name: 'comment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      //ột đối tượng cấu hình cho biết tên cột trong bảng trung gian tương ứng với khóa ngoại của Entity liên quan.
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  likes: User[];

  likeCount: number;

  @ManyToMany((type) => User, { cascade: true })
  @JoinTable({
    name: 'comment_unlike',
    joinColumn: {
      name: 'comment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  unlikes: User[];

  unlikeCount: number;
}
