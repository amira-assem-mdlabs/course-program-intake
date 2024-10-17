import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Course } from './course.entity';
import { ILearner } from '../../../common/interfaces/learner.interface';

@Entity('user_completed_course')
export class UserCompletedCourse extends BaseEntity {
    @Column({ type: 'float', name: 'score', nullable: true })
    score: number | null;

    @ManyToOne('nhi_user', { nullable: false })
    learner: ILearner;

    @ManyToOne(() => Course, { nullable: false })
    course: Course;

    // constructor(score: number | null = null, learner: ILearner, course: Course) {
    //     super();
    //     this.score = score;
    //     this.learner = learner;
    //     this.course = course;
    // }
}
