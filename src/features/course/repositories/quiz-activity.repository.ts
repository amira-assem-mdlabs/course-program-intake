import { EntityRepository, Repository } from 'typeorm';
import { QuizActivity } from '../entities/quiz-activity.entity';

@EntityRepository(QuizActivity)
export class QuizActivityRepository extends Repository<QuizActivity> {}
