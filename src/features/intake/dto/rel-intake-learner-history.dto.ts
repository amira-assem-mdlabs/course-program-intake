import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { IntakeDTO } from './intake.dto';

export class RelIntakeLearnerHistoryDTO extends BaseDTO {
    @ApiProperty({ description: 'progress field', required: false })
    progress: number;

    @ApiProperty({ description: 'score field', required: false })
    score: number;

    @ApiProperty({ description: 'learner relationship', required: false })
    learner: ILearner;

    @ApiProperty({ type: () => IntakeDTO, description: 'intake relationship', required: false })
    intake: IntakeDTO;

    // constructor(progress: number, learner: ILearner, intake: IntakeDTO, score?: number) {
    //     super();
    //     this.progress = progress;
    //     this.learner = learner;
    //     this.intake = intake;
    //     this.score = score ?? null;
    // }
}
