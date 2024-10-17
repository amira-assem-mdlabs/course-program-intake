import { Entity, Column, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { QuizActivity } from './quiz-activity.entity';
import { McqQuestion } from './mcq-question.entity';
import { ShortAnswerQuestion } from './short-answer-question.entity';
import { TrueOrFalseQuestion } from './true-or-false-question.entity';
import { QuestionType } from '../../../common/enumeration/question-type';

@Entity('question')
export class Question extends BaseEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ type: 'simple-enum', name: 'type', enum: QuestionType })
    type: QuestionType;

    @ManyToOne(type => QuizActivity)
    quizActivity: QuizActivity;

    @OneToOne(type => McqQuestion, other => other.question)
    mcqQuestion: McqQuestion;

    @OneToOne(type => ShortAnswerQuestion, other => other.question)
    shortAnswerQuestion: ShortAnswerQuestion;

    @OneToOne(type => TrueOrFalseQuestion, other => other.question)
    trueOrFalseQuestion: TrueOrFalseQuestion;

    // constructor(title: string, type: QuestionType, quizActivity: QuizActivity) {
    //     super();
    //     this.title = title;
    //     this.type = type;
    //     this.quizActivity = quizActivity;
    // }
}
