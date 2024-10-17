import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ActivityDTO } from './activity.dto';
import { BaseDTO } from '../../../common/dto/base.dto';

export class ArticleActivityDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'content field' })
    content: string;

    @ApiProperty({
        type: () => ActivityDTO,
        description: 'activity relationship',
        required: false,
    })
    activity: ActivityDTO;

    // constructor(content: string, activity: ActivityDTO) {
    //     super();
    //     this.content = content;
    //     this.activity = activity;
    // }
}
