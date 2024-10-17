import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { McqQuestionDTO } from './mcq-question.dto';

export class McqChoiceDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'title field' })
    title: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'isAnswer field' })
    isAnswer: boolean;

    @ApiProperty({ type: () => McqQuestionDTO, description: 'mcqQuestion relationship', required: false })
    mcqQuestion: McqQuestionDTO;

    // constructor(title: string, isAnswer: boolean, mcqQuestion: McqQuestionDTO) {
    //     super();
    //     this.title = title;
    //     this.isAnswer = isAnswer;
    //     this.mcqQuestion = mcqQuestion;
    // }
}
