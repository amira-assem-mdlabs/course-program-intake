import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { LessonDTO } from './lesson.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

export class RelLessonLearnerDTO extends BaseDTO {
    @ApiProperty({ description: 'learner relationship', required: true })
    learner: ILearner;

    @ApiProperty({ type: () => LessonDTO, description: 'lesson relationship', required: true })
    lesson: LessonDTO;

    // constructor(learner: ILearner, lesson: LessonDTO) {
    //     super();
    //     this.learner = learner;
    //     this.lesson = lesson;
    // }
}
