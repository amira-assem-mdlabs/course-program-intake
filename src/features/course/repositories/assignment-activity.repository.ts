import { EntityRepository, Repository } from 'typeorm';
import { AssignmentActivity } from '../entities/assignment-activity.entity';

@EntityRepository(AssignmentActivity)
export class AssignmentActivityRepository extends Repository<AssignmentActivity> {}
