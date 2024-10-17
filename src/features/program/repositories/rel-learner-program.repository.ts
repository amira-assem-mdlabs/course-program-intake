import { EntityRepository, Repository } from 'typeorm';
import { RelLearnerProgram } from '../entities/rel-learner-program.entity';

@EntityRepository(RelLearnerProgram)
export class RelLearnerProgramRepository extends Repository<RelLearnerProgram> {}
