import { Entity, ManyToOne } from 'typeorm';
import { Intake } from './intake.entity';
import { Course } from '../../course/entities/course.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('rel_intake_course')
export class RelIntakeCourse extends BaseEntity {
    @ManyToOne(type => Course)
    course: Course;

    @ManyToOne(type => Intake)
    intake: Intake;

    // constructor(course: Course, intake: Intake) {
    //     super();
    //     this.course = course;
    //     this.intake = intake;
    // }
}
