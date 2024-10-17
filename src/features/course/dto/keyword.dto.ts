import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CourseDTO } from './course.dto';
import { BaseDTO } from '../../../common/dto/base.dto';

export class KeywordDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'name field' })
    name: string;

    @ApiProperty({ type: () => CourseDTO, isArray: true, description: 'courses relationship', required: false })
    courses: CourseDTO[];

    // constructor(name: string, courses?: CourseDTO[]) {
    //     super();
    //     this.name = name;
    //     this.courses = courses ?? null;
    // }
}
