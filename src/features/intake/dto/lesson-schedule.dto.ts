import { ApiProperty } from '@nestjs/swagger';

import { IntakeStudyPlanDTO } from './intake-study-plan.dto';
import { BaseDTO } from '../../../common/dto/base.dto';
import { LessonDTO } from '../../course/dto/lesson.dto';

export class LessonScheduleDTO extends BaseDTO {
    @ApiProperty({ description: 'startDate field', required: false })
    startDate: string;

    @ApiProperty({ type: () => LessonDTO, description: 'lesson relationship' })
    lesson: LessonDTO;

    @ApiProperty({ type: () => IntakeStudyPlanDTO, description: 'intakeStudyPlan relationship' })
    intakeStudyPlan: IntakeStudyPlanDTO;
}
