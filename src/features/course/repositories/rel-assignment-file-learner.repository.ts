import { EntityRepository, Repository } from 'typeorm';
import { RelAssignmentFileLearner } from '../entities/rel-assignment-file-learner.entity';

@EntityRepository(RelAssignmentFileLearner)
export class RelAssignmentFileLearnerRepository extends Repository<RelAssignmentFileLearner> {}
