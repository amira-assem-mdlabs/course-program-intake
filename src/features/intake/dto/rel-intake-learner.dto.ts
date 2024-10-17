import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { IntakeDTO } from './intake.dto';

export class RelIntakeLearnerDTO extends BaseDTO {
    @ApiProperty({ description: 'learner relationship', required: true })
    learner: ILearner;

    @ApiProperty({ type: () => IntakeDTO, description: 'intake relationship', required: true })
    intake: IntakeDTO;

    // constructor(learner: ILearner, intake: IntakeDTO) {
    //     super();
    //     this.learner = learner;
    //     this.intake = intake;
    // }
}
