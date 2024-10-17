import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { TrackDTO } from './track.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

export class UserCompletedTrackDTO extends BaseDTO {
    @ApiProperty({ description: 'learner relationship', required: false })
    learner: ILearner;

    @ApiProperty({ type: () => TrackDTO, description: 'track relationship', required: false })
    track: TrackDTO;

    // constructor(learner: ILearner, track: TrackDTO) {
    //     super();
    //     this.learner = learner;
    //     this.track = track;
    // }
}
