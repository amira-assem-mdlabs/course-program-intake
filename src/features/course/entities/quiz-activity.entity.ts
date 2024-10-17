import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Activity } from './activity.entity';
import { Question } from './question.entity';
import { QuizAttempt } from './quiz-attempt.entity';

@Entity('quiz_activity')
export class QuizActivity extends BaseEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ type: 'integer', name: 'time' })
    time: number;

    @Column({ type: 'integer', name: 'number_of_attempts' })
    numberOfAttempts: number;

    @Column({ type: 'float', name: 'pass_rate' })
    passRate: number;

    @Column({ type: 'integer', name: 'jhi_order', nullable: true })
    order: number;

    @Column({ type: 'boolean', name: 'show_correct_answer', nullable: true })
    showCorrectAnswer: boolean;

    @OneToOne(type => Activity)
    @JoinColumn()
    activity: Activity;

    @OneToMany(type => Question, other => other.quizActivity)
    questions: Question[];

    @OneToMany(type => QuizAttempt, other => other.quiz)
    quizAttempts: QuizAttempt[];

    // constructor(
    //     title: string,
    //     time: number,
    //     numberOfAttempts: number,
    //     passRate: number,
    //     activity: Activity,
    //     showCorrectAnswer: boolean = true,
    //     order?: number,
    // ) {
    //     super();
    //     this.title = title;
    //     this.time = time;
    //     this.numberOfAttempts = numberOfAttempts;
    //     this.passRate = passRate;
    //     this.activity = activity;
    //     this.order = order || null;
    //     this.showCorrectAnswer = showCorrectAnswer;
    //     this.questions = [];
    //     this.quizAttempts = [];
    // }
}
