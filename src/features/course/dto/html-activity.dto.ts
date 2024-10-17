import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { ActivityDTO } from './activity.dto';
import { BaseDTO } from '../../../common/dto/base.dto';

export class HtmlActivityDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'htmlUrl field' })
    htmlUrl: string;

    @ApiProperty({
        type: () => ActivityDTO,
        description: 'activity relationship',
        required: false,
    })
    activity: ActivityDTO;

    // constructor(htmlUrl: string, activity: ActivityDTO) {
    //     super();
    //     this.htmlUrl = htmlUrl;
    //     this.activity = activity;
    // }
}
