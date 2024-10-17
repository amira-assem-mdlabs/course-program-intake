import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ProgramDTO } from '../../program/dto/program.dto';
import { IntakeDTO } from './intake.dto';

export class RelIntakeProgramDTO extends BaseDTO {
    @ApiProperty({ type: () => ProgramDTO, description: 'program relationship', required: true })
    program: ProgramDTO;

    @ApiProperty({ type: () => IntakeDTO, description: 'intake relationship', required: true })
    intake: IntakeDTO;

    // constructor(program: ProgramDTO, intake: IntakeDTO) {
    //     super();
    //     this.program = program;
    //     this.intake = intake;
    // }
}
