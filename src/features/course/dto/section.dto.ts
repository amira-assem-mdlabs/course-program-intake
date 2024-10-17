import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { LessonDTO } from './lesson.dto';
import { CourseDTO } from './course.dto';

export class SectionDTO extends BaseDTO {
    @ApiProperty({ description: 'slug field', required: false })
    slug: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'name field' })
    name: string;

    @ApiProperty({ description: 'description field', required: false })
    description: string;

    @ApiProperty({ description: 'order field', required: false })
    order: number;

    @ApiProperty({ type: () => LessonDTO, isArray: true, description: 'lessons relationship', required: false })
    lessons: LessonDTO[];

    @ApiProperty({ type: () => CourseDTO, description: 'course relationship', required: false })
    course: CourseDTO;

    // constructor(
    //     name: string,
    //     course: CourseDTO,
    //     slug?: string,
    //     description?: string,
    //     order?: number,
    //     lessons: LessonDTO[] = [],
    // ) {
    //     super();
    //     this.slug = slug ?? null;
    //     this.name = name;
    //     this.description = description ?? null;
    //     this.order = order ?? null;
    //     this.lessons = lessons;
    //     this.course = course;
    // }
}
