import { Entity, ManyToOne } from 'typeorm';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { Intake } from './intake.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('rel_intake_learner')
export class RelIntakeLearner extends BaseEntity {
    @ManyToOne('nhi_ILearner')
    learner: ILearner;

    @ManyToOne(type => Intake)
    intake: Intake;

    // constructor(learner: ILearner, intake: Intake) {
    //     super();
    //     this.learner = learner;
    //     this.intake = intake;
    // }
}
