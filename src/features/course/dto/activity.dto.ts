import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LessonDTO } from './lesson.dto';
import { VideoActivityDTO } from './video-activity.dto';
import { AudioActivityDTO } from './audio-activity.dto';
import { HtmlActivityDTO } from './html-activity.dto';
import { ArticleActivityDTO } from './article-activity.dto';
import { QuizActivityDTO } from './quiz-activity.dto';
import { AssignmentActivityDTO } from './assignment-activity.dto';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ActivityType } from '../../../common/enumeration/activity-type';

export class ActivityDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'name field' })
    name: string;

    @ApiProperty({ description: 'description field', required: false })
    description: string;

    @ApiProperty({ description: 'order field', required: false })
    order: number;

    @ApiProperty({ enum: ActivityType, description: 'type enum field', required: false })
    type: ActivityType;

    @ApiProperty({ description: 'download field', required: false })
    download: boolean;

    @ApiProperty({ type: () => LessonDTO, description: 'lesson relationship' })
    lesson: LessonDTO;

    @ApiProperty({ type: () => VideoActivityDTO, description: 'videoActivity relationship' })
    videoActivity: VideoActivityDTO;

    @ApiProperty({ type: () => AudioActivityDTO, description: 'audioActivity relationship' })
    audioActivity: AudioActivityDTO;

    @ApiProperty({ type: () => HtmlActivityDTO, description: 'htmlActivity relationship' })
    htmlActivity: HtmlActivityDTO;

    @ApiProperty({ type: () => ArticleActivityDTO, description: 'articleActivity relationship' })
    articleActivity: ArticleActivityDTO;

    @ApiProperty({ type: () => QuizActivityDTO, description: 'quizActivity relationship' })
    quizActivity: QuizActivityDTO;

    @ApiProperty({ type: () => AssignmentActivityDTO, description: 'assignmentActivity relationship' })
    assignmentActivity: AssignmentActivityDTO;

    // constructor(
    //     name: string,
    //     lesson: LessonDTO,
    //     type: ActivityType,
    //     description?: string,
    //     order?: number,
    //     download?: boolean,
    //     videoActivity?: VideoActivityDTO,
    //     audioActivity?: AudioActivityDTO,
    //     htmlActivity?: HtmlActivityDTO,
    //     articleActivity?: ArticleActivityDTO,
    //     quizActivity?: QuizActivityDTO,
    //     assignmentActivity?: AssignmentActivityDTO,
    // ) {
    //     super();
    //     this.name = name;
    //     this.lesson = lesson;
    //     this.description = description ?? null;
    //     this.order = order ?? null;
    //     this.type = type;
    //     this.download = download ?? null;
    //     this.videoActivity = videoActivity;
    //     this.audioActivity = audioActivity;
    //     this.htmlActivity = htmlActivity;
    //     this.articleActivity = articleActivity;
    //     this.quizActivity = quizActivity;
    //     this.assignmentActivity = assignmentActivity;
    // }
}
