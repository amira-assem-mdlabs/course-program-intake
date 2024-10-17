import { EntityRepository, Repository } from 'typeorm';
import { McqQuestion } from '../entities/mcq-question.entity';

@EntityRepository(McqQuestion)
export class McqQuestionRepository extends Repository<McqQuestion> {}
