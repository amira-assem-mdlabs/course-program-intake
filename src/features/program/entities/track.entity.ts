import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RelTrackCourse } from './rel-track-course.entity';

import { Program } from './program.entity';
import { UserCompletedTrack } from './user-completed-track.entity';
import { RelIntakeTrack } from '../../intake/entities/rel-intake-track.entity';
// import { UserTrackCertificate } from "./user-track-certificate.entity";
// import { UserCompletedTrack } from "./user-completed-track.entity";

@Entity('track')
export class Track extends BaseEntity {
    @Column({ name: 'name_en', nullable: true })
    nameEn: string;

    @Column({ name: 'name_ar', nullable: true })
    nameAr: string;

    @Column({ name: 'description_en', nullable: true })
    descriptionEn: string;

    @Column({ name: 'description_ar', nullable: true })
    descriptionAr: string;

    @Column({ name: 'slug' })
    slug: string;

    @Column({ type: 'integer', name: 'jhi_order', nullable: true })
    order: number;

    @Column({ type: 'boolean', name: 'course_in_order', nullable: true })
    courseInOrder: boolean;

    @OneToMany(type => RelTrackCourse, other => other.track)
    relTrackCourses: RelTrackCourse[];

    @OneToMany(type => UserCompletedTrack, other => other.track)
    userCompletedTracks: UserCompletedTrack[];

    @OneToMany(type => RelIntakeTrack, other => other.track)
    relIntakeTracks: RelIntakeTrack[];

    @ManyToOne(type => Program)
    program: Program;

    //   @OneToMany((type) => UserTrackCertificate, (other) => other.track)
    //   userTrackCertificates: UserTrackCertificate[];

    // constructor(
    //     slug: string,
    //     program: Program,
    //     nameEn?: string,
    //     nameAr?: string,
    //     descriptionEn?: string,
    //     descriptionAr?: string,
    //     order?: number,
    //     courseInOrder: boolean = false,
    // ) {
    //     super();
    //     this.slug = slug;
    //     this.program = program;
    //     this.nameEn = nameEn ?? null;
    //     this.nameAr = nameAr ?? null;
    //     this.descriptionEn = descriptionEn ?? null;
    //     this.descriptionAr = descriptionAr ?? null;
    //     this.order = order ?? null;
    //     this.courseInOrder = courseInOrder ?? null;
    //     this.relTrackCourses = [];
    //     this.relIntakeTracks = [];
    //     this.userCompletedTracks = [];
    //     // this.userTrackCertificates = [];
    //     // this.userCompletedTracks = [];
    // }
}
