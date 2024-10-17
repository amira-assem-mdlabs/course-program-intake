import { Entity, Column, OneToMany } from 'typeorm';
import { RelIntakeLearner } from './rel-intake-learner.entity';
import { RelIntakeLearnerHistory } from './rel-intake-learner-history.entity';
import { IntakeStatus } from '../../../common/enumeration/intake-status';
import { RelIntakeCourse } from './rel-intake-course.entity';
import { RelIntakeProgram } from './rel-intake-program.entity';
import { RelIntakeTrack } from './rel-intake-track.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

// import { RelProgramSession } from "./rel-program-session.entity";
// import { RelCourseSession } from "./rel-course-session.entity";
// import { IntakeStudyPlan } from "./intake-study-plan.entity";

@Entity('intake')
export class Intake extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ type: 'date', name: 'registration_start_date', nullable: true })
    registrationStartDate: any;

    @Column({ type: 'date', name: 'registration_end_date', nullable: true })
    registrationEndDate: any;

    @Column({ type: 'date', name: 'learning_start_date', nullable: true })
    learningStartDate: any;

    @Column({ type: 'date', name: 'learning_end_date', nullable: true })
    learningEndDate: any;

    @Column({ type: 'integer', name: 'capacity', nullable: true })
    capacity: number;

    @Column({ type: 'simple-enum', name: 'status', enum: IntakeStatus })
    status: IntakeStatus;

    @OneToMany(type => RelIntakeCourse, other => other.intake)
    relIntakeCourses: RelIntakeCourse[];

    @OneToMany(type => RelIntakeProgram, other => other.intake)
    relIntakePrograms: RelIntakeProgram[];

    @OneToMany(type => RelIntakeTrack, other => other.intake)
    relIntakeTracks: RelIntakeTrack[];

    @OneToMany(type => RelIntakeLearner, other => other.intake)
    relIntakeLearners: RelIntakeLearner[];

    @OneToMany(type => RelIntakeLearnerHistory, other => other.intake)
    relIntakeLearnerHistories: RelIntakeLearnerHistory[];

    // @OneToMany((type) => IntakeStudyPlan, (other) => other.intake)
    // intakeStudyPlans: IntakeStudyPlan[];

    //   @OneToMany((type) => RelProgramSession, (other) => other.intake)
    //   relProgramSessions: RelProgramSession[];

    //   @OneToMany((type) => RelCourseSession, (other) => other.intake)
    //   relCourseSessions: RelCourseSession[];

    // constructor(
    //     status: IntakeStatus,
    //     name?: string,
    //     registrationStartDate?: any,
    //     registrationEndDate?: any,
    //     learningStartDate?: any,
    //     learningEndDate?: any,
    //     capacity?: number,
    // ) {
    //     super();
    //     this.status = status;
    //     this.name = name ?? null;
    //     this.registrationStartDate = registrationStartDate ?? null;
    //     this.registrationEndDate = registrationEndDate ?? null;
    //     this.learningStartDate = learningStartDate ?? null;
    //     this.learningEndDate = learningEndDate ?? null;
    //     this.capacity = capacity ?? null;
    //     this.relIntakeCourses = [];
    //     this.relIntakePrograms = [];
    //     this.relIntakeTracks = [];
    //     this.relIntakeLearners = [];
    //     this.relIntakeLearnerHistories = [];
    //     // this.intakeStudyPlans = [];
    //     // this.relProgramSessions = [];
    //     // this.relCourseSessions = [];
    // }
}
