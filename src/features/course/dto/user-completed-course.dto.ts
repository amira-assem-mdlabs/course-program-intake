import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { CourseDTO } from './course.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

export class UserCompletedCourseDTO extends BaseDTO {
    @ApiProperty({ description: 'score field', required: false })
    score: number;

    @ApiProperty({ description: 'learner relationship', required: true })
    learner: ILearner;

    @ApiProperty({ type: () => CourseDTO, description: 'course relationship', required: true })
    course: CourseDTO;

    // constructor(learner: ILearner, course: CourseDTO, score?: number) {
    //     super();
    //     this.score = score ?? null;
    //     this.learner = learner;
    //     this.course = course;
    // }
}
