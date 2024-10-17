import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CourseBasicInfo {
    @IsNotEmpty()
    @ApiProperty({ description: 'Course Id' })
    id: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'Course name' })
    name: string;

    // constructor(id: number, name: string) {
    //     this.id = id;
    //     this.name = name;
    // }
}
