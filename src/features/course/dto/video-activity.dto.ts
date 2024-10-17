import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ActivityDTO } from './activity.dto';

export class VideoActivityDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'videoUrl field' })
    videoUrl: string;

    @ApiProperty({ description: 'mandatoryWatching field', required: false })
    mandatoryWatching: boolean;

    @ApiProperty({ type: () => ActivityDTO, description: 'activity relationship', required: false })
    activity: ActivityDTO;

    // constructor(videoUrl: string, mandatoryWatching: boolean = false, activity: ActivityDTO) {
    //     super();
    //     this.videoUrl = videoUrl;
    //     this.mandatoryWatching = mandatoryWatching;
    //     this.activity = activity;
    // }
}
