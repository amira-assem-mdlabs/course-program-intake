import { Entity, Column, ManyToOne, BaseEntity } from 'typeorm';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { Intake } from './intake.entity';

@Entity('rel_intake_learner_history')
export class RelIntakeLearnerHistory extends BaseEntity {
    @Column({ type: 'float', name: 'progress', nullable: true })
    progress: number;

    @Column({ type: 'float', name: 'score', nullable: true })
    score: number;

    @ManyToOne('nhi_user')
    learner: ILearner;

    @ManyToOne(type => Intake)
    intake: Intake;

    // constructor(learner: ILearner, intake: Intake, progress: number = 0, score: number = 0) {
    //     super();
    //     this.learner = learner;
    //     this.intake = intake;
    //     this.progress = progress ?? null;
    //     this.score = score ?? null;
    // }
}
