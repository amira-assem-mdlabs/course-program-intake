import { ApiProperty } from '@nestjs/swagger';
import { IntakeDTO } from './intake.dto';
import { BaseDTO } from '../../../common/dto/base.dto';
import { LessonScheduleDTO } from './lesson-schedule.dto';

export class IntakeStudyPlanDTO extends BaseDTO {
    @ApiProperty({ description: 'autoScheduler field', required: false })
    autoScheduler: boolean;

    @ApiProperty({ description: 'startDate field', required: false })
    startDate: string;

    @ApiProperty({ description: 'daysPerLesson field', required: false })
    daysPerLesson: number;

    @ApiProperty({ type: () => LessonScheduleDTO, isArray: true, description: 'lessonSchedules relationship' })
    lessonSchedules: LessonScheduleDTO[];

    @ApiProperty({ type: () => IntakeDTO, description: 'intake relationship' })
    intake: IntakeDTO;
}
