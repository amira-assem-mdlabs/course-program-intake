import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ProgramDTO } from './program.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

export class RelLearnerProgramDTO extends BaseDTO {
    @ApiProperty({ description: 'learner relationship', required: true })
    learner: ILearner;

    @ApiProperty({ type: () => ProgramDTO, description: 'program relationship', required: true })
    program: ProgramDTO;

    // constructor(learner: ILearner, program: ProgramDTO) {
    //     super();
    //     this.learner = learner;
    //     this.program = program;
    // }
}
