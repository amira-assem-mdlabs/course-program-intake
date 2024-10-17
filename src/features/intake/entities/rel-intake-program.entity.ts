import { Entity, ManyToOne } from 'typeorm';
import { Intake } from './intake.entity';
import { Program } from '../../program/entities/program.entity';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('rel_intake_program')
export class RelIntakeProgram extends BaseEntity {
    @ManyToOne(type => Program)
    program: Program;

    @ManyToOne(type => Intake)
    intake: Intake;

    // constructor(program: Program, intake: Intake) {
    //     super();
    //     this.program = program;
    //     this.intake = intake;
    // }
}
