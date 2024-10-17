import { EntityRepository, Repository } from 'typeorm';
import { GradingSystem } from '../entities/grading-system.entity';

@EntityRepository(GradingSystem)
export class GradingSystemRepository extends Repository<GradingSystem> {}
