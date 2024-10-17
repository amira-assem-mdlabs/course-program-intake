import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { ActivityDTO } from './activity.dto';

export class CourseGradableActivityDTO extends BaseDTO {
    @ApiProperty({ description: 'course field' })
    course: {
        id: number;
        name: string;
    };

    @ApiProperty({ description: 'section gradable activities field' })
    sectionsGradableActivities: {
        id: number;
        name: string;
        activities?: {
            assignments?: {
                lessonId: number;
                lessonName: string;
                data: ActivityDTO;
            }[];
            quizzes?: {
                lessonId: number;
                lessonName: string;
                data: ActivityDTO;
            }[];
        };
    }[];
    // constructor(
    //     course: { id: number; name: string },
    //     sectionsGradableActivities: {
    //         id: number;
    //         name: string;
    //         activities?: {
    //             assignments?: {
    //                 lessonId: number;
    //                 lessonName: string;
    //                 data: ActivityDTO;
    //             }[];
    //             quiz?: {
    //                 lessonId: number;
    //                 lessonName: string;
    //                 data: ActivityDTO;
    //             }[];
    //         };
    //     }[],
    // ) {
    //     super();
    //     this.course = course;
    //     this.sectionsGradableActivities = sectionsGradableActivities;
    // }
}
