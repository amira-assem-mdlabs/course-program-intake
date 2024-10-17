import { ApiProperty } from '@nestjs/swagger';
import { CourseDTO } from '../../course/dto/course.dto';
import { ProgramDTO } from '../../program/dto/program.dto';
import { IntakeDTO } from './intake.dto';

export class IntakeExtendDTO extends IntakeDTO {
    @ApiProperty({ description: 'content type field', required: false })
    contentType: string;

    @ApiProperty({ description: 'content id field', required: false })
    contentID: number;

    @ApiProperty({ description: 'course field', required: false })
    course: CourseDTO;

    @ApiProperty({ description: 'program field', required: false })
    program: ProgramDTO;

    @ApiProperty({ description: 'tracks studying period field', required: false })
    tracksStudyingPeriod: { [key: string]: string[] };

    // constructor(
    //     learningStartDate: any,
    //     learningEndDate: any,
    //     status: IntakeStatus,
    //     contentType?: string,
    //     contentID?: number,
    //     course?: CourseDTO,
    //     program?: ProgramDTO,
    //     tracksStudyingPeriod?: { [key: string]: string[] },
    // ) {
    //     super(learningEndDate, learningEndDate, status);
    //     this.contentType = contentType ?? null;
    //     this.contentID = contentID ?? null;
    //     this.course = course ?? null;
    //     this.program = program ?? null;
    //     this.tracksStudyingPeriod = tracksStudyingPeriod ?? null;
    // }
}

export class FindIntakeByLearnerOptionsDTO {
    @ApiProperty({ description: 'learnerId field' })
    learnerId: number;

    @ApiProperty({ description: 'programId field', required: false })
    programId?: number;

    @ApiProperty({ description: 'courseId field', required: false })
    courseId?: number;

    // constructor(learnerId: number, programId?: number, courseId?: number) {
    //     this.learnerId = learnerId;
    //     this.programId = programId ?? null;
    //     this.courseId = courseId ?? null;
    // }
}
