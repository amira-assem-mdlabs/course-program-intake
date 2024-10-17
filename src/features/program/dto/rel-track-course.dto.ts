import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/dto/base.dto';
import { TrackDTO } from './track.dto';
import { CourseDTO } from '../../course/dto/course.dto';

export class RelTrackCourseDTO extends BaseDTO {
    @ApiProperty({ description: 'order field', required: false })
    order: number;

    @ApiProperty({ type: () => TrackDTO, description: 'track relationship', required: true })
    track: TrackDTO;

    @ApiProperty({ type: () => CourseDTO, description: 'course relationship', required: true })
    course: CourseDTO;

    // constructor(track: TrackDTO, course: CourseDTO, order?: number) {
    //     super();
    //     this.order = order ?? null;
    //     this.track = track;
    //     this.course = course;
    // }
}
