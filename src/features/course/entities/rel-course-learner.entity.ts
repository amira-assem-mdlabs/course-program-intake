import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Course } from './course.entity';
import { ILearner } from '../../../common/interfaces/learner.interface';

@Entity('rel_course_learner')
export class RelCourseLearner extends BaseEntity {
    @ManyToOne('nhi_user')
    learner: ILearner;

    @ManyToOne(type => Course)
    course: Course;

    // constructor(learner: ILearner, course: Course) {
    //     super();
    //     this.learner = learner;
    //     this.course = course;
    // }
}
