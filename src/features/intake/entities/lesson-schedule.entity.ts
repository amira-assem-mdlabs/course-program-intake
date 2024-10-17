import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Lesson } from '../../course/entities/lesson.entity';
import { IntakeStudyPlan } from './intake-study-plan.entity';

@Entity('lesson_schedule')
export class LessonSchedule extends BaseEntity {
    @Column({ name: 'start_date', nullable: true })
    startDate: string;

    @ManyToOne(type => Lesson)
    lesson: Lesson;

    @ManyToOne(type => IntakeStudyPlan)
    intakeStudyPlan: IntakeStudyPlan;

    // constructor(lesson: Lesson, intakeStudyPlan: IntakeStudyPlan, startDate?: string) {
    //     super();
    //     this.lesson = lesson;
    //     this.intakeStudyPlan = intakeStudyPlan;
    //     this.startDate = startDate ?? null;
    // }
}
