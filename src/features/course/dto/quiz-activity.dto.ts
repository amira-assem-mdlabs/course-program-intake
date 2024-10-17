import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ActivityDTO } from './activity.dto';
import { QuestionDTO } from './question.dto';
import { QuizAttemptDTO } from './quiz-attempt.dto';

export class QuizActivityDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'title field' })
    title: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'time field' })
    time: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'numberOfAttempts field' })
    numberOfAttempts: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'passRate field' })
    passRate: number;

    @ApiProperty({ description: 'order field', required: false })
    order: number;

    @ApiProperty({ description: 'showCorrectAnswer field', required: false })
    showCorrectAnswer: boolean;

    @ApiProperty({ type: () => ActivityDTO, description: 'activity relationship', required: false })
    activity: ActivityDTO;

    @ApiProperty({ type: () => QuestionDTO, isArray: true, description: 'questions relationship', required: false })
    questions: QuestionDTO[];

    @ApiProperty({
        type: () => QuizAttemptDTO,
        isArray: true,
        description: 'quizAttempts relationship',
        required: false,
    })
    quizAttempts: QuizAttemptDTO[];

    // constructor(
    //     title: string,
    //     time: number,
    //     numberOfAttempts: number,
    //     passRate: number,
    //     showCorrectAnswer: boolean = false,
    //     activity: ActivityDTO,
    //     order?: number,
    //     questions: QuestionDTO[] = [],
    //     quizAttempts: QuizAttemptDTO[] = [],
    // ) {
    //     super();
    //     this.title = title;
    //     this.time = time;
    //     this.numberOfAttempts = numberOfAttempts;
    //     this.passRate = passRate;
    //     this.order = order ?? null;
    //     this.showCorrectAnswer = showCorrectAnswer;
    //     this.activity = activity;
    //     this.questions = questions;
    //     this.quizAttempts = quizAttempts;
    // }
}
