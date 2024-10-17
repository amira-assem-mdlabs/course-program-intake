import { ApiProperty } from '@nestjs/swagger';
import { CourseDTO } from './course.dto';

export class CourseExtendDTO extends CourseDTO {
    @ApiProperty({ type: () => Number })
    numOfLessons?: number;

    @ApiProperty({ type: () => Number })
    numOfSections?: number;

    @ApiProperty({ type: () => Number })
    numOfActivities?: number;

    @ApiProperty({ type: () => Number })
    numOfQuizes?: number;

    @ApiProperty({ type: () => Number })
    progress?: number;

    numberOfEnrollments?: number;

    numberOfCertificates?: number;

    progressRate?: number;
}
