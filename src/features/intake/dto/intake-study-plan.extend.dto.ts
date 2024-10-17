import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IntakeDTO } from './intake.dto';
import { IntakeStudyPlanDTO } from './intake-study-plan.dto';
import { CourseDTO } from '../../course/dto/course.dto';
import { ProgramDTO } from '../../program/dto/program.dto';

export class PartialIntakeDTO extends PartialType(IntakeDTO) {}

export class IntakeStudyPlanExtendDTO extends OmitType(IntakeStudyPlanDTO, ['intake']) {
    @ApiProperty({ type: () => CourseDTO, required: false })
    course?: CourseDTO;

    @ApiProperty({ type: () => ProgramDTO, required: false })
    program?: ProgramDTO;

    @ApiProperty({ enum: ['COURSE', 'PROGRAM'], description: 'Type of the study plan' })
    planType?: 'COURSE' | 'PROGRAM';

    @ApiProperty({ type: () => PartialIntakeDTO, required: false })
    intake?: PartialIntakeDTO;
}
