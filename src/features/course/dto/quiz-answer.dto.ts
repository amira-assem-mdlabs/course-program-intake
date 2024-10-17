import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { QuestionDTO } from './question.dto';
import { QuizAttemptDTO } from './quiz-attempt.dto';

export class QuizAnswerDTO extends BaseDTO {
    @ApiProperty({ description: 'isRight field', required: false })
    isRight: boolean;

    @ApiProperty({ type: () => QuestionDTO, description: 'question relationship', required: false })
    question: QuestionDTO;

    @ApiProperty({ type: () => QuizAttemptDTO, description: 'attempt relationship', required: false })
    attempt: QuizAttemptDTO;

    // constructor(isRight: boolean, question: QuestionDTO, attempt: QuizAttemptDTO) {
    //     super();
    //     this.isRight = isRight;
    //     this.question = question;
    //     this.attempt = attempt;
    // }
}
