import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { QuizActivityDTO } from './quiz-activity.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

export class QuizAttemptDTO extends BaseDTO {
    @ApiProperty({ description: 'score field', required: false })
    score: number;

    @ApiProperty({ description: 'learner relationship', required: false })
    learner: ILearner;

    @ApiProperty({ type: () => QuizActivityDTO, description: 'quiz relationship', required: false })
    quiz: QuizActivityDTO;

    // constructor(score: number, learner: ILearner, quiz: QuizActivityDTO) {
    //     super();
    //     this.score = score;
    //     this.learner = learner;
    //     this.quiz = quiz;
    // }
}
