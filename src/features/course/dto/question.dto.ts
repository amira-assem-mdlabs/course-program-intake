import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { QuizActivityDTO } from './quiz-activity.dto';
import { McqQuestionDTO } from './mcq-question.dto';
import { ShortAnswerQuestionDTO } from './short-answer-question.dto';
import { TrueOrFalseQuestionDTO } from './true-or-false-question.dto';
import { QuestionType } from '../../../common/enumeration/question-type';

export class QuestionDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'title field' })
    title: string;

    @ApiProperty({ enum: QuestionType, description: 'type enum field', required: false })
    type: QuestionType;

    @ApiProperty({ type: () => QuizActivityDTO, description: 'quizActivity relationship', required: false })
    quizActivity: QuizActivityDTO;

    @ApiProperty({ type: () => McqQuestionDTO, description: 'mcqQuestion relationship', required: false })
    mcqQuestion: McqQuestionDTO;

    @ApiProperty({
        type: () => ShortAnswerQuestionDTO,
        description: 'shortAnswerQuestion relationship',
        required: false,
    })
    shortAnswerQuestion: ShortAnswerQuestionDTO;

    @ApiProperty({
        type: () => TrueOrFalseQuestionDTO,
        description: 'trueOrFalseQuestion relationship',
        required: false,
    })
    trueOrFalseQuestion: TrueOrFalseQuestionDTO;

    // constructor(
    //     title: string,
    //     type: QuestionType,
    //     quizActivity: QuizActivityDTO,
    //     mcqQuestion?: McqQuestionDTO,
    //     shortAnswerQuestion?: ShortAnswerQuestionDTO,
    //     trueOrFalseQuestion?: TrueOrFalseQuestionDTO,
    // ) {
    //     super();
    //     this.title = title;
    //     this.type = type;
    //     this.quizActivity = quizActivity;
    //     this.mcqQuestion = mcqQuestion ?? null;
    //     this.shortAnswerQuestion = shortAnswerQuestion ?? null;
    //     this.trueOrFalseQuestion = trueOrFalseQuestion ?? null;
    // }
}
