import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { QuizActivity } from './quiz-activity.entity';
import { ILearner } from '../../../common/interfaces/learner.interface';

@Entity('quiz_attempt')
export class QuizAttempt extends BaseEntity {
    @Column({ type: 'float', name: 'score', nullable: true })
    score: number;

    @ManyToOne('nhi_user')
    learner: ILearner;

    @ManyToOne(type => QuizActivity)
    quiz: QuizActivity;

    // constructor(learner: ILearner, quiz: QuizActivity, score: number = 0) {
    //     super();
    //     this.learner = learner;
    //     this.quiz = quiz;
    //     this.score = score;
    // }
}
