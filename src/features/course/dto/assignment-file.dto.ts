import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { AssignmentActivityDTO } from './assignment-activity.dto';
import { BaseDTO } from '../../../common/dto/base.dto';

export class AssignmentFileDTO extends BaseDTO {
    @ApiProperty({ description: 'title field', required: false })
    title: string;

    @ApiProperty({ description: 'description field', required: false })
    description: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'url field' })
    url: string;

    @ApiProperty({ type: () => AssignmentActivityDTO, description: 'assignment relationship' })
    assignment: AssignmentActivityDTO;

    // constructor(url: string, assignment: AssignmentActivityDTO, title?: string, description?: string) {
    //     super();
    //     this.url = url;
    //     this.title = title ?? null;
    //     this.description = description ?? null;
    //     this.assignment = assignment;
    // }
}
