import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Question } from './question.entity';

@Entity('true_or_false_question')
export class TrueOrFalseQuestion extends BaseEntity {
    @Column({ type: 'boolean', name: 'answer' })
    answer: boolean;

    @OneToOne(type => Question)
    @JoinColumn()
    question: Question;

    // constructor(answer: boolean, question: Question) {
    //     super();
    //     this.answer = answer;
    //     this.question = question;
    // }
}
