import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Intake } from './intake.entity';
import { LessonSchedule } from './lesson-schedule.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('intake_study_plan')
export class IntakeStudyPlan extends BaseEntity {
    @Column({ type: 'boolean', name: 'auto_scheduler', nullable: true })
    autoScheduler: boolean;

    @Column({ name: 'start_date', nullable: true })
    startDate: string;

    @Column({ type: 'integer', name: 'days_per_lesson', nullable: true })
    daysPerLesson: number;

    @OneToMany(type => LessonSchedule, other => other.intakeStudyPlan)
    lessonSchedules: LessonSchedule[];

    @ManyToOne(type => Intake)
    intake: Intake;

    // constructor(intake: Intake, autoScheduler: boolean = false, startDate?: string, daysPerLesson?: number) {
    //     super();
    //     this.intake = intake;
    //     this.autoScheduler = autoScheduler ?? null;
    //     this.startDate = startDate ?? null;
    //     this.daysPerLesson = daysPerLesson ?? null;
    //     this.lessonSchedules = [];
    // }
}
