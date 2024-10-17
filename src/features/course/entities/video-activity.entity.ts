import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Activity } from './activity.entity';

@Entity('video_activity')
export class VideoActivity extends BaseEntity {
    @Column({ name: 'video_url' })
    videoUrl: string;

    @Column({ type: 'boolean', name: 'mandatory_watching', nullable: true })
    mandatoryWatching: boolean;

    @OneToOne(type => Activity)
    @JoinColumn()
    activity: Activity;

    // constructor(videoUrl: string, activity: Activity, mandatoryWatching: boolean = false) {
    //     super();
    //     this.videoUrl = videoUrl;
    //     this.activity = activity;
    //     this.mandatoryWatching = mandatoryWatching;
    // }
}
