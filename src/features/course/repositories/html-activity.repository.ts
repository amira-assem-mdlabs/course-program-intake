import { EntityRepository, Repository } from 'typeorm';
import { HtmlActivity } from '../entities/html-activity.entity';

@EntityRepository(HtmlActivity)
export class HtmlActivityRepository extends Repository<HtmlActivity> {}
