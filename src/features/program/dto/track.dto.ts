import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
// import { UserTrackCertificateDTO } from './user-track-certificate.dto';
import { RelTrackCourseDTO } from './rel-track-course.dto';
import { UserCompletedTrackDTO } from './user-completed-track.dto';

import { ProgramDTO } from './program.dto';
import { RelIntakeTrackDTO } from '../../intake/dto/rel-intake-track.dto';

export class TrackDTO extends BaseDTO {
    @ApiProperty({ description: 'nameEn field', required: false })
    nameEn: string;

    @ApiProperty({ description: 'nameAr field', required: false })
    nameAr: string;

    @ApiProperty({ description: 'descriptionEn field', required: false })
    descriptionEn: string;

    @ApiProperty({ description: 'descriptionAr field', required: false })
    descriptionAr: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'slug field' })
    slug: string;

    @ApiProperty({ description: 'order field', required: false })
    order: number;

    @ApiProperty({ description: 'courseInOrder field', required: false })
    courseInOrder: boolean;

    // @ApiProperty({
    //     type: () => UserTrackCertificateDTO,
    //     isArray: true,
    //     description: 'userTrackCertificates relationship',
    //     required: false
    // })
    // userTrackCertificates: UserTrackCertificateDTO[] | null;

    @ApiProperty({
        type: () => RelTrackCourseDTO,
        isArray: true,
        description: 'relTrackCourses relationship',
        required: false,
    })
    relTrackCourses: RelTrackCourseDTO[];

    @ApiProperty({
        type: () => UserCompletedTrackDTO,
        isArray: true,
        description: 'userCompletedTracks relationship',
        required: false,
    })
    userCompletedTracks: UserCompletedTrackDTO[];

    @ApiProperty({
        type: () => RelIntakeTrackDTO,
        isArray: true,
        description: 'relIntakeTracks relationship',
        required: false,
    })
    relIntakeTracks: RelIntakeTrackDTO[];

    @ApiProperty({ type: () => ProgramDTO, description: 'program relationship', required: true })
    program: ProgramDTO;

    // constructor(
    //     slug: string,
    //     program: ProgramDTO,
    //     nameEn?: string,
    //     nameAr?: string,
    //     descriptionEn?: string,
    //     descriptionAr?: string,
    //     order?: number,
    //     courseInOrder: boolean = false,
    //     relTrackCourses: RelTrackCourseDTO[] = [],
    //     userCompletedTracks: UserCompletedTrackDTO[] = [],
    //     relIntakeTracks: RelIntakeTrackDTO[] = [],
    //     // userTrackCertificates?: UserTrackCertificateDTO[],
    // ) {
    //     super();
    //     this.slug = slug;
    //     this.nameEn = nameEn ?? null;
    //     this.nameAr = nameAr ?? null;
    //     this.descriptionEn = descriptionEn ?? null;
    //     this.descriptionAr = descriptionAr ?? null;
    //     this.order = order ?? null;
    //     this.courseInOrder = courseInOrder;
    //     this.relTrackCourses = relTrackCourses;
    //     this.userCompletedTracks = userCompletedTracks;
    //     this.relIntakeTracks = relIntakeTracks;
    //     this.program = program ?? null;
    //     // this.userTrackCertificates = userTrackCertificates ?? null;
    // }
}
