import { EntityRepository, Repository } from 'typeorm';
import { Intake } from '../entities/intake.entity';

@EntityRepository(Intake)
export class IntakeRepository extends Repository<Intake> {}
