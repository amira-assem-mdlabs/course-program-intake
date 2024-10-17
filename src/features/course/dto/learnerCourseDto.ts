import { ApiProperty } from '@nestjs/swagger';
import { CourseDTO } from './course.dto';
import { IntakeDTO } from '../../intake/dto/intake.dto';
// import { TransactionItemDTO } from './transaction-item.dto';

export class LearnerCourseDTO extends CourseDTO {
    @ApiProperty({ description: 'enrolled field', required: false })
    enrolled?: boolean;

    @ApiProperty({ description: 'progress in course', required: false })
    progress?: number;

    @ApiProperty({ description: 'How much lessons the student finished per course', required: false })
    completedCourses?: number;

    learnerIntake?: IntakeDTO;

    intakesCount?: number;

    intake?: IntakeDTO;

    currentIntake?: IntakeDTO | null;

    upComingIntake?: IntakeDTO | null;

    enrolledIntake?: IntakeDTO;

    // @ApiProperty({ type: () => TransactionItemDTO, isArray: true, description: 'transactionItems relationship' })
    // transactionItems: TransactionItemDTO[];
}
