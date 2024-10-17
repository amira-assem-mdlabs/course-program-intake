import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { ActivityDTO } from './activity.dto';
import { BaseDTO } from '../../../common/dto/base.dto';

export class AudioActivityDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'audioUrl field' })
    audioUrl: string;

    @ApiProperty({
        type: () => ActivityDTO,
        description: 'activity relationship',
        required: false,
    })
    activity: ActivityDTO;

    // constructor(audioUrl: string, activity: ActivityDTO) {
    //     super();
    //     this.audioUrl = audioUrl;
    //     this.activity = activity;
    // }
}
