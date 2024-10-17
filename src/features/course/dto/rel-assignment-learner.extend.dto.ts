import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { AssignmentActivityDTO } from './assignment-activity.dto';
import { CourseDTO } from './course.dto';
import { LessonDTO } from './lesson.dto';
import { RelAssignmentFileLearnerDTO } from './rel-assignment-file-learner.dto';
import { SectionDTO } from './section.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

export class RelAssignmentLearnerExtendDTO extends BaseDTO {
    @ApiProperty({ description: 'grade field', required: false })
    grade: number;

    @ApiProperty({ description: 'isSubmitted field', required: false })
    isSubmitted: boolean;

    @ApiProperty({ description: 'submissionDate field', required: false })
    submissionDate: string;

    @ApiProperty({ description: 'lecturerNotes field', required: false })
    lecturerNotes: string;

    @ApiProperty({ description: 'feedbackFileUrl field', required: false })
    feedbackFileUrl: string;

    @ApiProperty({ description: 'correctionDate field', required: false })
    correctionDate: string;

    @ApiProperty({
        type: () => RelAssignmentFileLearnerDTO,
        isArray: true,
        description: 'relAssignmentFileLearners relationship',
    })
    relAssignmentFileLearners: RelAssignmentFileLearnerDTO[];

    @ApiProperty({ type: () => AssignmentActivityDTO, description: 'assignment relationship' })
    assignment: AssignmentActivityDTO;

    @ApiProperty({ description: 'learner relationship' })
    learner: ILearner;

    course?: CourseDTO;

    section?: SectionDTO;

    lesson?: LessonDTO;
}
