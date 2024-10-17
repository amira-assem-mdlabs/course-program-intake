import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TrackDTO } from './track.dto';
import { RelTrackCourseExtendDTO } from './rel-track-course.extend.dto';

/**
 * A TrackExtendDTO object.
 */
export class TrackExtendDTO extends OmitType(TrackDTO, ['relTrackCourses'] as const) {
    @ApiProperty({ type: () => RelTrackCourseExtendDTO, isArray: true, description: 'relTrackCourses relationship' })
    relTrackCourses: RelTrackCourseExtendDTO[] = [];

    @ApiProperty({ description: 'track progress field', required: false })
    progress?: number;
}
