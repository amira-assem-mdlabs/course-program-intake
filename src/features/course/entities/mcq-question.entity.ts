import { Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Question } from './question.entity';
import { McqChoice } from './mcq-choice.entity';

@Entity('mcq_question')
export class McqQuestion extends BaseEntity {
    @OneToOne(type => Question)
    @JoinColumn()
    question: Question;

    @OneToMany(type => McqChoice, other => other.mcqQuestion)
    mcqChoices: McqChoice[];

    // constructor(question: Question) {
    //     super();
    //     this.question = question;
    //     this.mcqChoices = [];
    // }
}
