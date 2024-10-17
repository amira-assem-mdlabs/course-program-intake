import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { QuestionDTO } from './question.dto';

export class TrueOrFalseQuestionDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'answer field' })
    answer: boolean;

    @ApiProperty({ type: () => QuestionDTO, description: 'question relationship', required: true })
    question: QuestionDTO;

    // constructor(answer: boolean, question: QuestionDTO) {
    //     super();
    //     this.answer = answer;
    //     this.question = question;
    // }
}
