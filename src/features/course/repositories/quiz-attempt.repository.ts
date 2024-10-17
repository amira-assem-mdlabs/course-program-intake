import { EntityRepository, Repository } from 'typeorm';
import { QuizAttempt } from '../entities/quiz-attempt.entity';

@EntityRepository(QuizAttempt)
export class QuizAttemptRepository extends Repository<QuizAttempt> {}
