import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

import { Activity } from './activity.entity';

@Entity('article_activity')
export class ArticleActivity extends BaseEntity {
    @Column({ name: 'content' })
    content: string;

    @OneToOne(type => Activity)
    @JoinColumn()
    activity: Activity;

    // constructor(content: string, activity: Activity) {
    //     super();
    //     this.content = content;
    //     this.activity = activity;
    // }
}
