import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { CourseDTO } from './course.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

export class RelCourseLearnerDTO extends BaseDTO {
    @ApiProperty({ description: 'learner relationship', required: true })
    learner: ILearner;

    @ApiProperty({ type: () => CourseDTO, description: 'course relationship', required: true })
    course: CourseDTO;

    // constructor(learner: ILearner, course: CourseDTO) {
    //     super();
    //     this.learner = learner;
    //     this.course = course;
    // }
}
