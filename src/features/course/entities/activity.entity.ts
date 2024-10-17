import { Entity, Column, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

import { Lesson } from './lesson.entity';
import { VideoActivity } from './video-activity.entity';
import { AudioActivity } from './audio-activity.entity';
import { HtmlActivity } from './html-activity.entity';
import { ArticleActivity } from './article-activity.entity';
import { QuizActivity } from './quiz-activity.entity';
import { AssignmentActivity } from './assignment-activity.entity';
import { ActivityType } from '../../../common/enumeration/activity-type';

@Entity('activity')
export class Activity extends BaseEntity {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ type: 'integer', name: 'jhi_order', nullable: true })
    order: number;

    @Column({ type: 'simple-enum', name: 'type', enum: ActivityType })
    type: ActivityType;

    @Column({ type: 'boolean', name: 'download', nullable: true })
    download: boolean;

    @ManyToOne(type => Lesson)
    lesson: Lesson;

    @OneToOne(type => VideoActivity, other => other.activity)
    videoActivity: VideoActivity;

    @OneToOne(type => AudioActivity, other => other.activity)
    audioActivity: AudioActivity;

    @OneToOne(type => HtmlActivity, other => other.activity)
    htmlActivity: HtmlActivity;

    @OneToOne(type => ArticleActivity, other => other.activity)
    articleActivity: ArticleActivity;

    @OneToOne(type => QuizActivity, other => other.activity)
    quizActivity: QuizActivity;

    @OneToOne(type => AssignmentActivity, other => other.activity)
    assignmentActivity: AssignmentActivity;

    // constructor(
    //     name: string,
    //     description: string = '',
    //     order: number = 0,
    //     type: ActivityType,
    //     download: boolean = false,
    //     lesson: Lesson,
    // ) {
    //     super();
    //     this.name = name;
    //     this.description = description;
    //     this.order = order;
    //     this.type = type;
    //     this.download = download;
    //     this.lesson = lesson;
    // }
}
