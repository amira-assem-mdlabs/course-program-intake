import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { QuestionDTO } from './question.dto';
import { McqChoiceDTO } from './mcq-choice.dto';

export class McqQuestionDTO extends BaseDTO {
    @ApiProperty({ type: () => QuestionDTO, description: 'question relationship', required: false })
    question: QuestionDTO;

    @ApiProperty({ type: () => McqChoiceDTO, isArray: true, description: 'mcqChoices relationship', required: false })
    mcqChoices: McqChoiceDTO[];

    // constructor(question: QuestionDTO, mcqChoices: McqChoiceDTO[]) {
    //     super();
    //     this.question = question;
    //     this.mcqChoices = mcqChoices;
    // }
}
