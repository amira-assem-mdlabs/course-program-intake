import { EntityRepository, Repository } from 'typeorm';
import { RelAssignmentLearner } from '../entities/rel-assignment-learner.entity';

@EntityRepository(RelAssignmentLearner)
export class RelAssignmentLearnerRepository extends Repository<RelAssignmentLearner> {}
