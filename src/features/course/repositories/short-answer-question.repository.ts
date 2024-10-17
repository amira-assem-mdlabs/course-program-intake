import { EntityRepository, Repository } from 'typeorm';
import { ShortAnswerQuestion } from '../entities/short-answer-question.entity';

@EntityRepository(ShortAnswerQuestion)
export class ShortAnswerQuestionRepository extends Repository<ShortAnswerQuestion> {}
