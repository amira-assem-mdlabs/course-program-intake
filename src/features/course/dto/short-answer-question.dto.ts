import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { QuestionDTO } from './question.dto';

export class ShortAnswerQuestionDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'answer field' })
    answer: string;

    @ApiProperty({ type: () => QuestionDTO, description: 'question relationship', required: true })
    question: QuestionDTO;

    // constructor(answer: string, question: QuestionDTO) {
    //     super();
    //     this.answer = answer;
    //     this.question = question;
    // }
}
