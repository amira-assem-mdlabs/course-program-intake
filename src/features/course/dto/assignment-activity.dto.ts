import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ActivityDTO } from './activity.dto';
import { AssignmentFileDTO } from './assignment-file.dto';
import { RelAssignmentLearnerDTO } from './rel-assignment-learner.dto';
import { BaseDTO } from '../../../common/dto/base.dto';

export class AssignmentActivityDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'title field' })
    title: string;

    @ApiProperty({ description: 'description field', required: false })
    description: string;

    @ApiProperty({ description: 'grade field', required: false })
    grade: number;

    @ApiProperty({ description: 'duration field', required: false })
    duration: number;

    @ApiProperty({ description: 'numOfFiles field', required: false })
    numOfFiles: number;

    @ApiProperty({ description: 'fileType field', required: false })
    fileType: string;

    @ApiProperty({ type: () => ActivityDTO, description: 'activity relationship' })
    activity: ActivityDTO;

    @ApiProperty({ type: () => AssignmentFileDTO, isArray: true, description: 'assignmentFiles relationship' })
    assignmentFiles: AssignmentFileDTO[];

    @ApiProperty({
        type: () => RelAssignmentLearnerDTO,
        isArray: true,
        description: 'relAssignmentLearners relationship',
    })
    relAssignmentLearners: RelAssignmentLearnerDTO[];

    // constructor(
    //     title: string,
    //     activity: ActivityDTO,
    //     description?: string,
    //     grade?: number,
    //     duration?: number,
    //     numOfFiles?: number,
    //     fileType?: string,
    //     assignmentFiles?: AssignmentFileDTO[],
    //     relAssignmentLearners?: RelAssignmentLearnerDTO[],
    // ) {
    //     super();
    //     this.title = title;
    //     this.description = description ?? null;
    //     this.grade = grade ?? null;
    //     this.duration = duration ?? null;
    //     this.numOfFiles = numOfFiles ?? null;
    //     this.fileType = fileType ?? null;
    //     this.activity = activity;
    //     this.assignmentFiles = assignmentFiles ?? [];
    //     this.relAssignmentLearners = relAssignmentLearners ?? [];
    // }
}
