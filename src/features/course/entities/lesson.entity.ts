import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Activity } from './activity.entity';

import { Section } from './section.entity';
import { RelLessonLearner } from './rel-lesson-learner.entity';
// import { LessonSchedule } from '../../intake/entities/lesson-schedule.entity';

@Entity('lesson')
export class Lesson extends BaseEntity {
    @Column({ name: 'slug', nullable: true })
    slug: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ type: 'integer', name: 'jhi_order', nullable: true })
    order: number;

    @OneToMany(type => Activity, other => other.lesson)
    activities: Activity[];

    @OneToMany(type => RelLessonLearner, other => other.lesson)
    relLessonLearners: RelLessonLearner[];

    // @OneToMany(type => LessonSchedule, other => other.lesson)
    // lessonSchedules: LessonSchedule[];

    @ManyToOne(type => Section)
    section: Section;

    // constructor(name: string, section: Section, slug?: string, description?: string, order?: number) {
    //     super();
    //     this.name = name;
    //     this.section = section;
    //     this.slug = slug;
    //     this.description = description;
    //     this.order = order;
    //     this.activities = [];
    //     this.relLessonLearners = [];
    //     this.lessonSchedules = [];
    // }
}
