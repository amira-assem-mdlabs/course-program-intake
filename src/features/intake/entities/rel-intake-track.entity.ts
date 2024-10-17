import { Entity, Column, ManyToOne } from 'typeorm';
import { Intake } from './intake.entity';
import { Track } from '../../program/entities/track.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('rel_intake_track')
export class RelIntakeTrack extends BaseEntity {
    @Column({ type: 'date', name: 'learning_start_date', nullable: true })
    learningStartDate: any;

    @Column({ type: 'date', name: 'learning_end_date', nullable: true })
    learningEndDate: any;

    @ManyToOne(type => Track)
    track: Track;

    @ManyToOne(type => Intake)
    intake: Intake;

    // constructor(track: Track, intake: Intake, learningStartDate?: any, learningEndDate?: any) {
    //     super();
    //     this.track = track;
    //     this.intake = intake;
    //     this.learningStartDate = learningStartDate ?? null;
    //     this.learningEndDate = learningEndDate ?? null;
    // }
}
