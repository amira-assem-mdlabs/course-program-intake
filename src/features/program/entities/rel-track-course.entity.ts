import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

import { Course } from '../../course/entities/course.entity';
import { Track } from './track.entity';

@Entity('rel_track_course')
export class RelTrackCourse extends BaseEntity {
    @Column({ type: 'integer', name: 'jhi_order', nullable: true })
    order: number;

    @ManyToOne(type => Track)
    track: Track;

    @ManyToOne(type => Course)
    course: Course;

    // constructor(track: Track, course: Course, order?: number) {
    //     super();
    //     this.track = track;
    //     this.course = course;
    //     this.order = order ?? null;
    // }
}
