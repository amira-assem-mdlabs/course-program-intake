import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { RelAssignmentLearnerDTO } from './rel-assignment-learner.dto';

export class RelAssignmentFileLearnerDTO extends BaseDTO {
    @ApiProperty({ description: 'name field', required: false })
    name: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'url field' })
    url: string;

    @ApiProperty({
        type: () => RelAssignmentLearnerDTO,
        description: 'learnerAssignment relationship',
        required: true,
    })
    learnerAssignment: RelAssignmentLearnerDTO;

    // constructor(url: string, learnerAssignment: RelAssignmentLearnerDTO, name?: string) {
    //     super();
    //     this.url = url;
    //     this.name = name ?? null;
    //     this.learnerAssignment = learnerAssignment;
    // }
}
