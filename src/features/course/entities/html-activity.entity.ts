import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Activity } from './activity.entity';

@Entity('html_activity')
export class HtmlActivity extends BaseEntity {
    @Column({ name: 'html_url' })
    htmlUrl: string;

    @OneToOne(type => Activity)
    @JoinColumn()
    activity: Activity;

    // constructor(htmlUrl: string, activity: Activity) {
    //     super();
    //     this.htmlUrl = htmlUrl;
    //     this.activity = activity;
    // }
}
