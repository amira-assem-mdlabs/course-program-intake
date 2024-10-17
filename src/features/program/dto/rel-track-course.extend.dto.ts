import { ApiProperty, OmitType } from '@nestjs/swagger';
import { RelTrackCourseDTO } from './rel-track-course.dto';
import { TrackExtendDTO } from './track.extend.dto';
import { CourseExtendDTO } from '../../course/dto/course.extend.dto';

export class RelTrackCourseExtendDTO extends OmitType(RelTrackCourseDTO, ['track', 'course'] as const) {
    @ApiProperty({ type: () => TrackExtendDTO, description: 'track relationship', required: true })
    track: TrackExtendDTO;

    @ApiProperty({ type: () => CourseExtendDTO, description: 'course relationship', required: true })
    course: CourseExtendDTO;

    // constructor(track: TrackExtendDTO, course: CourseExtendDTO) {
    //     super();
    //     this.track = track;
    //     this.course = course;
    // }
}
