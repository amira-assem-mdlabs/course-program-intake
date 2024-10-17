import { ApiProperty } from '@nestjs/swagger';

import { IntakeDTO } from './intake.dto';
import { BaseDTO } from '../../../common/dto/base.dto';
import { CourseDTO } from '../../course/dto/course.dto';

export class RelIntakeCourseDTO extends BaseDTO {
    @ApiProperty({ type: () => CourseDTO, description: 'course relationship', required: true })
    course: CourseDTO;

    @ApiProperty({ type: () => IntakeDTO, description: 'intake relationship', required: true })
    intake: IntakeDTO;

    // constructor(course: CourseDTO, intake: IntakeDTO) {
    //     super();
    //     this.course = course;
    //     this.intake = intake;
    // }
}
