import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Program } from './program.entity';
import { ILearner } from '../../../common/interfaces/learner.interface';

@Entity('rel_learner_program')
export class RelLearnerProgram extends BaseEntity {
    @ManyToOne('nhi_user')
    learner: ILearner;

    @ManyToOne(type => Program)
    program: Program;

    // constructor(learner: ILearner, program: Program) {
    //     super();
    //     this.learner = learner;
    //     this.program = program;
    // }
}
