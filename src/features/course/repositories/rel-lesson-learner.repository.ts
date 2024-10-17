import { EntityRepository, Repository } from 'typeorm';
import { RelLessonLearner } from '../entities/rel-lesson-learner.entity';

@EntityRepository(RelLessonLearner)
export class RelLessonLearnerRepository extends Repository<RelLessonLearner> {}
