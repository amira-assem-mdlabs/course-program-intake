import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { RelAssignmentFileLearnerDTO } from './rel-assignment-file-learner.dto';
import { AssignmentActivityDTO } from './assignment-activity.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { CourseDTO } from './course.dto';
import { LessonDTO } from './lesson.dto';
import { SectionDTO } from './section.dto';

export class RelAssignmentLearnerDTO extends BaseDTO {
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

    @ApiProperty({ description: 'learnerNote field', required: false })
    learnerNote: string;

    @ApiProperty({
        type: () => RelAssignmentFileLearnerDTO,
        isArray: true,
        description: 'relAssignmentFileLearners relationship',
        required: false,
    })
    relAssignmentFileLearners: RelAssignmentFileLearnerDTO[];

    @ApiProperty({ description: 'learner relationship', required: false })
    learner: ILearner;

    @ApiProperty({ type: () => AssignmentActivityDTO, description: 'assignment relationship', required: false })
    assignment: AssignmentActivityDTO;

    @ApiProperty({ type: () => CourseDTO, description: 'course relationship', required: false })
    course?: CourseDTO;

    @ApiProperty({ type: () => SectionDTO, description: 'section relationship', required: false })
    section?: SectionDTO;

    @ApiProperty({ type: () => LessonDTO, description: 'lesson relationship', required: false })
    lesson?: LessonDTO;

    // constructor(
    //     learner: ILearner,
    //     assignment: AssignmentActivityDTO,
    //     isSubmitted: boolean = false,
    //     grade?: number,
    //     submissionDate?: string,
    //     lecturerNotes?: string,
    //     feedbackFileUrl?: string,
    //     correctionDate?: string,
    //     learnerNote?: string,
    //     relAssignmentFileLearners: RelAssignmentFileLearnerDTO[] = [],
    // ) {
    //     super();
    //     this.grade = grade ?? null;
    //     this.isSubmitted = isSubmitted;
    //     this.submissionDate = submissionDate ?? null;
    //     this.lecturerNotes = lecturerNotes ?? null;
    //     this.feedbackFileUrl = feedbackFileUrl ?? null;
    //     this.correctionDate = correctionDate ?? null;
    //     this.learnerNote = learnerNote ?? null;
    //     this.relAssignmentFileLearners = relAssignmentFileLearners;
    //     this.learner = learner;
    //     this.assignment = assignment;
    // }
}
