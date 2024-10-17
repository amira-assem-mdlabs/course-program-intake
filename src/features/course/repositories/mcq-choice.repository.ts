import { EntityRepository, Repository } from 'typeorm';
import { McqChoice } from '../entities/mcq-choice.entity';

@EntityRepository(McqChoice)
export class McqChoiceRepository extends Repository<McqChoice> {}
