import { EntityRepository, Repository } from 'typeorm';
import { ArticleActivity } from '../entities/article-activity.entity';

@EntityRepository(ArticleActivity)
export class ArticleActivityRepository extends Repository<ArticleActivity> {}
