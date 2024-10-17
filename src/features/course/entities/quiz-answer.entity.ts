import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Question } from './question.entity';
import { QuizAttempt } from './quiz-attempt.entity';

@Entity('quiz_answer')
export class QuizAnswer extends BaseEntity {
    @Column({ type: 'boolean', name: 'is_right', nullable: true })
    isRight: boolean;

    @ManyToOne(type => Question)
    question: Question;

    @ManyToOne(type => QuizAttempt)
    attempt: QuizAttempt;

    // constructor(question: Question, attempt: QuizAttempt, isRight: boolean = false) {
    //     super();
    //     this.question = question;
    //     this.attempt = attempt;
    //     this.isRight = isRight;
    // }
}
