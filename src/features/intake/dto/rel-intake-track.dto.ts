import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { TrackDTO } from '../../program/dto/track.dto';
import { IntakeDTO } from './intake.dto';

export class RelIntakeTrackDTO extends BaseDTO {
    @ApiProperty({ description: 'learningStartDate field', required: true })
    learningStartDate: any;

    @ApiProperty({ description: 'learningEndDate field', required: true })
    learningEndDate: any;

    @ApiProperty({ type: () => TrackDTO, description: 'track relationship', required: true })
    track: TrackDTO;

    @ApiProperty({ type: () => IntakeDTO, description: 'intake relationship', required: true })
    intake: IntakeDTO;

    // constructor(learningStartDate: any, learningEndDate: any, track: TrackDTO, intake: IntakeDTO) {
    //     super();
    //     this.learningStartDate = learningStartDate;
    //     this.learningEndDate = learningEndDate;
    //     this.track = track;
    //     this.intake = intake;
    // }
}
