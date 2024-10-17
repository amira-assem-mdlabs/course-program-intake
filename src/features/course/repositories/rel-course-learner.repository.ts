import { EntityRepository, Repository } from 'typeorm';
import { RelCourseLearner } from '../entities/rel-course-learner.entity';

@EntityRepository(RelCourseLearner)
export class RelCourseLearnerRepository extends Repository<RelCourseLearner> {}
