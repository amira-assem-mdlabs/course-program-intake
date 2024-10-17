import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Question } from './question.entity';

@Entity('short_answer_question')
export class ShortAnswerQuestion extends BaseEntity {
    @Column({ name: 'answer' })
    answer: string;

    @OneToOne(type => Question)
    @JoinColumn()
    question: Question;

    // constructor(answer: string, question: Question) {
    //     super();
    //     this.answer = answer;
    //     this.question = question;
    // }
}
