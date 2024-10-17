import { EntityRepository, Repository } from 'typeorm';
import { QuizAnswer } from '../entities/quiz-answer.entity';

@EntityRepository(QuizAnswer)
export class QuizAnswerRepository extends Repository<QuizAnswer> {}
