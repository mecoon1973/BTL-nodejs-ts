import { Repository, EntityManager } from 'typeorm';
import * as crypto from 'crypto';
import MyDataSource from '~/utils/myDataSource';
import { Comment } from '~/models/database/Comment';
import { ICreateCommentDto } from '~/interfaces/comment';
import { AnonymousUser } from '~/models/database/AnonymousUser';
import { User } from '~/models/database/User';
import { Post } from '~/models/database/Post';
import { EPostStatus } from '~/enums/post.enum';
import sendEmail from '~/utils/sendEmail';
import { ECommentVote } from '~/enums/comment.enum';

export class CommentService {
  public repo: Repository<Comment>;
  public manager: EntityManager; 
  
  constructor() {
    this.repo = MyDataSource.getRepository(Comment);
    this.manager = MyDataSource.manager;
  }
  async getManyByPost(postId: number) {
    let comments = await this.repo
   
      .createQueryBuilder('comment') 
      .leftJoinAndSelect('comment.children', 'children') 
      .leftJoinAndSelect('comment.anonymousAuthor', 'anonymousAuthor')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('children.anonymousAuthor', 'anonymousAuthorChild')
      .leftJoinAndSelect('children.author', 'authorChild')
      .leftJoinAndSelect('comment.likes', 'likes')
      .leftJoinAndSelect('comment.unlikes', 'unlikes')
      .where('comment.parentId IS NULL')
      .andWhere('comment.postId = :postId', { postId })
      .orderBy('children.createdAt', 'DESC') 
      .getMany();

    return comments;
  }
  async createOne(body: ICreateCommentDto) {
    let hash = ''; 
    try {
      let authorUser: any = null;
      let replyUser: any = null; 
      const comment = await this.manager.transaction(async (em) => {
        const post = await em.findOne(Post, {
          where: [{ slug: body.postSlug }, { status: EPostStatus.ACTIVE }],
        });
        if (!post) {
          throw new Error('Post not found!');
        }
        
        const comment = em.create(Comment, {
          content: body.content,
          post, 
        });
      
        if (body.parentId) {
          const parent = await em.findOne(Comment, {
            where: {
              id: body.parentId,
            },
            relations: ['anonymousAuthor', 'author'],
          });
          if (parent) {
            authorUser = parent.author
              ? { email: parent.author.email }
              : { email: parent.anonymousAuthor?.email };
            comment.parent = parent;
          }
        }
      
        if (body.isIncognito) {
          console.log(body.token);
          let anonymousUser = await em.findOne(AnonymousUser, {
            where: {
              hash: body.token || '',
            },
          });
          if (!anonymousUser) {
            anonymousUser = em.create(AnonymousUser, {
              userName: body.userName,
              hash: this.generateHash(body.email!),
              email: body.email,
            });
          }
          hash = anonymousUser.hash;
          comment.isIncognito = 1;
          comment.anonymousAuthor = anonymousUser;
          replyUser = {
            email: anonymousUser.email,
            userName: anonymousUser.userName,
          };
        } else {
          const user = await em.findOne(User, {
            where: { id: body.authorId },
          });
          if (!user) {
            throw new Error('User not found!');
          }
          comment.isIncognito = 0;
          comment.author = user;
          replyUser = {
            email: user.email,
            userName: user.name,
          };
        }
        if (authorUser && replyUser) {
          if (authorUser.email !== replyUser.email)
            await sendEmail.newComment(authorUser.email, replyUser.userName);
        }
        return await em.save(comment);
      });
      return {
        hash,
        comment,
      };
    } catch (e) {
      throw e;
    }
  }
  async like(id: number, userId: number) {
    let comment = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.likes', 'likes')
      .leftJoinAndSelect('comment.unlikes', 'unlikes')
      .where('comment.id = :id', { id })
      .getOne();
    if (comment) {
      comment = await this.vote(comment, ECommentVote.UP, userId);
      comment = this.toResponseObject(comment);
    }
    return comment;
  }

  async unlike(id: number, userId: number) {
    let comment = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.likes', 'likes')
      .leftJoinAndSelect('comment.unlikes', 'unlikes')
      .where('comment.id = :id', { id })
      .getOne();
    if (comment) {
      comment = await this.vote(comment, ECommentVote.DOWN, userId);
      comment = this.toResponseObject(comment);
    }
    return comment;
  }

  private async vote(comment: Comment, reaction: ECommentVote, userId: number) {
   
    const opposite =
      reaction === ECommentVote.UP ? ECommentVote.DOWN : ECommentVote.UP;
    const user = await this.manager
      .getRepository(User) 
      .findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("Can't find user.");
    }
    if (
      comment[opposite].filter((voter) => voter.id === user.id).length > 0 &&
    
      comment[reaction].filter((voter) => voter.id === user.id).length === 0
      
    ) {
      
      comment[opposite] = comment[opposite].filter(
        (voter) => voter.id !== user.id 
    
      );
      comment[reaction].push(user);
      await this.repo.save(comment); 
    } else if (
      
      comment[opposite].filter((voter) => voter.id === user.id).length > 0 ||
      comment[reaction].filter((voter) => voter.id === user.id).length > 0
    ) {
      comment[opposite] = comment[opposite].filter(
        (voter) => voter.id !== user.id
      );
      comment[reaction] = comment[reaction].filter(
        (voter) => voter.id !== user.id
      );
    
      await this.repo.save(comment);
    } else if (
      
      comment[reaction].filter((voter) => voter.id === user.id).length < 1
    ) {
      comment[reaction].push(user);
      await this.repo.save(comment);
    } else {
      throw new Error('Unable to cast vote');
    }
    return comment;
  }
  toResponseObject(comment: any) {
    
    comment.likeCount = comment.likes.length;
    comment.unlikeCount = comment.unlikes.length;
    delete comment.likes;
    delete comment.unlikes;
    return comment;
  }
  private generateHash(email: string) {
    const hash = crypto.createHash('sha256'); 
    hash.update(email);
    const randomId = hash.digest('hex');
    return randomId;
  }
}

export default new CommentService();
