import { EntityRepository, Repository } from 'typeorm';
import { GradingSystemItems } from '../entities/grading-system-items.entity';

@EntityRepository(GradingSystemItems)
export class GradingSystemItemsRepository extends Repository<GradingSystemItems> {}
