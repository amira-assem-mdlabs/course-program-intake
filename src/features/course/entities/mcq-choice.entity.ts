import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { McqQuestion } from './mcq-question.entity';

@Entity('mcq_choice')
export class McqChoice extends BaseEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ type: 'boolean', name: 'is_answer' })
    isAnswer: boolean;

    @ManyToOne(type => McqQuestion)
    mcqQuestion: McqQuestion;

    // constructor(title: string, isAnswer: boolean, mcqQuestion: McqQuestion) {
    //     super();
    //     this.title = title;
    //     this.isAnswer = isAnswer;
    //     this.mcqQuestion = mcqQuestion;
    // }
}
