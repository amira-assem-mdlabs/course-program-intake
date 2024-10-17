import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Track } from './track.entity';
import { ILearner } from '../../../common/interfaces/learner.interface';

@Entity('user_completed_track')
export class UserCompletedTrack extends BaseEntity {
    @ManyToOne('nhi_user', { nullable: false })
    learner: ILearner;

    @ManyToOne(() => Track, { nullable: false })
    track: Track;

    // constructor(learner: ILearner, track: Track) {
    //     super();
    //     this.learner = learner;
    //     this.track = track;
    // }
}
