import { EntityRepository, Repository } from 'typeorm';
import { TrueOrFalseQuestion } from '../entities/true-or-false-question.entity';

@EntityRepository(TrueOrFalseQuestion)
export class TrueOrFalseQuestionRepository extends Repository<TrueOrFalseQuestion> {}
