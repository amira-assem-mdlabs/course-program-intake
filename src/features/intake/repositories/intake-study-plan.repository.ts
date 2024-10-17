import { EntityRepository, Repository } from 'typeorm';
import { IntakeStudyPlan } from '../entities/intake-study-plan.entity';

@EntityRepository(IntakeStudyPlan)
export class IntakeStudyPlanRepository extends Repository<IntakeStudyPlan> {}
