import { ApiProperty, OmitType } from '@nestjs/swagger';

import { TrackExtendDTO } from './track.extend.dto';
import { IntakeDTO } from '../../intake/dto/intake.dto';
import { ProgramDTO } from './program.dto';

/**
 * A ProgramExtendDTO object.
 */
export class ProgramExtendDTO extends OmitType(ProgramDTO, ['tracks'] as const) {
    @ApiProperty({ description: 'track progress field', required: false })
    progress?: number;

    @ApiProperty({ type: () => TrackExtendDTO, isArray: true, description: 'tracks relationship' })
    tracks: TrackExtendDTO[] = [];

    @ApiProperty({ description: 'Total number of tracks per program field', required: false })
    tracksCount?: number;

    @ApiProperty({ description: 'Total number of courses per program field', required: false })
    coursesCount?: number;

    @ApiProperty({ description: 'Total number of enrolled students per program field', required: false })
    enrolledStudentsCount?: number;

    @ApiProperty({ description: 'Total number of enrolled students per program field', required: false })
    intakesCount?: number;

    @ApiProperty({ description: 'current or upcoming intake field', required: false })
    intake?: IntakeDTO;

    @ApiProperty({ description: 'program has current intake field', required: false })
    currentIntake?: IntakeDTO;

    @ApiProperty({ description: 'program has upcoming intake field', required: false })
    upcomigIntake?: IntakeDTO;

    @ApiProperty({ description: 'is learner enrolled in program field', required: false })
    enrolled?: boolean;

    @ApiProperty({ description: 'Learner enrolled intake field', required: false })
    enrolledIntake?: IntakeDTO;
}
