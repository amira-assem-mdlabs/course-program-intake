import { ApiProperty } from '@nestjs/swagger';
import { RelIntakeCourseDTO } from './rel-intake-course.dto';
import { RelIntakeProgramDTO } from './rel-intake-program.dto';
import { RelIntakeTrackDTO } from './rel-intake-track.dto';
import { RelIntakeLearnerDTO } from './rel-intake-learner.dto';
import { RelIntakeLearnerHistoryDTO } from './rel-intake-learner-history.dto';
import { BaseDTO } from '../../../common/dto/base.dto';
import { IntakeStatus } from '../../../common/enumeration/intake-status';

// import { IntakeStudyPlanDTO } from './intake-study-plan.dto';
// import { RelProgramSessionDTO } from './rel-program-session.dto';
// import { RelCourseSessionDTO } from './rel-course-session.dto';

export class IntakeDTO extends BaseDTO {
    @ApiProperty({ description: 'name field', required: false })
    name: string;

    @ApiProperty({ description: 'registrationStartDate field', required: false })
    registrationStartDate: any;

    @ApiProperty({ description: 'registrationEndDate field', required: false })
    registrationEndDate: any;

    @ApiProperty({ description: 'learningStartDate field', required: false })
    learningStartDate: any;

    @ApiProperty({ description: 'learningEndDate field', required: false })
    learningEndDate: any;

    @ApiProperty({ description: 'capacity field', required: false })
    capacity: number;

    @ApiProperty({
        enum: IntakeStatus,
        description: 'status enum field',
        required: false,
    })
    status: IntakeStatus;

    @ApiProperty({
        type: () => RelIntakeCourseDTO,
        isArray: true,
        description: 'relIntakeCourses relationship',
        required: false,
    })
    relIntakeCourses: RelIntakeCourseDTO[];

    @ApiProperty({
        type: () => RelIntakeProgramDTO,
        isArray: true,
        description: 'relIntakePrograms relationship',
        required: false,
    })
    relIntakePrograms: RelIntakeProgramDTO[];

    @ApiProperty({
        type: () => RelIntakeTrackDTO,
        isArray: true,
        description: 'relIntakeTracks relationship',
        required: false,
    })
    relIntakeTracks: RelIntakeTrackDTO[];

    @ApiProperty({
        type: () => RelIntakeLearnerDTO,
        isArray: true,
        description: 'relIntakeLearners relationship',
        required: false,
    })
    relIntakeLearners: RelIntakeLearnerDTO[];

    @ApiProperty({
        type: () => RelIntakeLearnerHistoryDTO,
        isArray: true,
        description: 'relIntakeLearnerHistories relationship',
        required: false,
    })
    relIntakeLearnerHistories: RelIntakeLearnerHistoryDTO[];

    // @ApiProperty({ type: () => IntakeStudyPlanDTO, isArray: true, description: 'intakeStudyPlans relationship', required: false })
    // intakeStudyPlans: IntakeStudyPlanDTO[] ;

    // @ApiProperty({ type: () => RelProgramSessionDTO, isArray: true, description: 'relProgramSessions relationship', required: false })
    // relProgramSessions: RelProgramSessionDTO[] ;

    // @ApiProperty({ type: () => RelCourseSessionDTO, isArray: true, description: 'relCourseSessions relationship', required: false })
    // relCourseSessions: RelCourseSessionDTO[] ;

    // constructor(
    //     learningStartDate: any,
    //     learningEndDate: any,
    //     status: IntakeStatus,
    //     name?: string,
    //     registrationStartDate?: any,
    //     registrationEndDate?: any,
    //     capacity?: number,
    //     relIntakeCourses: RelIntakeCourseDTO[] = [],
    //     relIntakePrograms: RelIntakeProgramDTO[] = [],
    //     relIntakeTracks: RelIntakeTrackDTO[] = [],
    //     relIntakeLearners: RelIntakeLearnerDTO[] = [],
    //     relIntakeLearnerHistories: RelIntakeLearnerHistoryDTO[] = [],
    //     // intakeStudyPlans?: IntakeStudyPlanDTO[],
    //     // relProgramSessions?: RelProgramSessionDTO[],
    //     // relCourseSessions?: RelCourseSessionDTO[]
    // ) {
    //     super();
    //     this.name = name ?? null;
    //     this.registrationStartDate = registrationStartDate ?? null;
    //     this.registrationEndDate = registrationEndDate ?? null;
    //     this.learningStartDate = learningStartDate;
    //     this.learningEndDate = learningEndDate;
    //     this.capacity = capacity ?? null;
    //     this.status = status;
    //     this.relIntakeCourses = relIntakeCourses ?? null;
    //     this.relIntakePrograms = relIntakePrograms ?? null;
    //     this.relIntakeTracks = relIntakeTracks ?? null;
    //     this.relIntakeLearners = relIntakeLearners ?? null;
    //     this.relIntakeLearnerHistories = relIntakeLearnerHistories ?? null;
    //     // this.intakeStudyPlans = intakeStudyPlans ?? null;
    //     // this.relProgramSessions = relProgramSessions ?? null;
    //     // this.relCourseSessions = relCourseSessions ?? null;
    // }
}
