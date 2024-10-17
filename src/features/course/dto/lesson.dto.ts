import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ActivityDTO } from './activity.dto';
import { RelLessonLearnerDTO } from './rel-lesson-learner.dto';
import { SectionDTO } from './section.dto';
// import { LessonScheduleDTO } from '../../intake/dto/lesson-schedule.dto';

export class LessonDTO extends BaseDTO {
    @ApiProperty({ description: 'slug field', required: false })
    slug: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'name field' })
    name: string;

    @ApiProperty({ description: 'description field', required: false })
    description: string;

    @ApiProperty({ description: 'order field', required: false })
    order: number;

    @ApiProperty({ type: () => ActivityDTO, isArray: true, description: 'activities relationship', required: false })
    activities: ActivityDTO[];

    @ApiProperty({
        type: () => RelLessonLearnerDTO,
        isArray: true,
        description: 'relLessonLearners relationship',
        required: false,
    })
    relLessonLearners: RelLessonLearnerDTO[];

    // @ApiProperty({
    //     type: () => LessonScheduleDTO,
    //     isArray: true,
    //     description: 'lessonSchedules relationship',
    //     required: false,
    // })
    // lessonSchedules: LessonScheduleDTO[];

    @ApiProperty({ type: () => SectionDTO, description: 'section relationship', required: false })
    section: SectionDTO;

    // constructor(
    //     name: string,
    //     section: SectionDTO,
    //     slug?: string,
    //     description?: string,
    //     order?: number,
    //     activities: ActivityDTO[] = [],
    //     relLessonLearners: RelLessonLearnerDTO[] = [],
    //     lessonSchedules: LessonScheduleDTO[] = [],
    // ) {
    //     super();
    //     this.name = name;
    //     this.slug = slug ?? null;
    //     this.description = description ?? null;
    //     this.order = order ?? null;
    //     this.activities = activities;
    //     this.relLessonLearners = relLessonLearners;
    //     this.lessonSchedules = lessonSchedules ?? null;
    //     this.section = section;
    // }
}
