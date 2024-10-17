import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

import { Activity } from './activity.entity';

@Entity('audio_activity')
export class AudioActivity extends BaseEntity {
    @Column({ name: 'audio_url' })
    audioUrl: string;

    @OneToOne(type => Activity)
    @JoinColumn()
    activity: Activity;

    // constructor(audioUrl: string, activity: Activity) {
    //     super();
    //     this.audioUrl = audioUrl;
    //     this.activity = activity;
    // }
}
