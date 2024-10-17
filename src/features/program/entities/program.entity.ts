import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

import { RelLearnerProgram } from './rel-learner-program.entity';
import { ProgramStatus } from '../../../common/enumeration/program-status';
import { Category } from '../../course/entities/category.entity';
import { RelIntakeProgram } from '../../intake/entities/rel-intake-program.entity';
import { Track } from './track.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
// import { RelCertificateProgram } from "./rel-certificate-program.entity";

// import { UserProgramCertificate } from "./user-program-certificate.entity";
// import { TransactionItem } from "./transaction-item.entity";
// import { RelCouponProgram } from "./rel-coupon-program.entity";
// import { RelProgramSession } from "./rel-program-session.entity";

@Entity('program')
export class Program extends BaseEntity {
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

    @Column({ name: 'cover_url', nullable: true })
    coverUrl: string;

    @Column({ name: 'intro_video_url', nullable: true })
    introVideoUrl: string;

    @Column({ type: 'date', name: 'start_date', nullable: true })
    startDate: any;

    @Column({ type: 'date', name: 'end_date', nullable: true })
    endDate: any;

    @Column({ name: 'meta_data', nullable: true })
    metaData: string;

    @Column({ type: 'simple-enum', name: 'status', enum: ProgramStatus })
    status: ProgramStatus;

    @Column({ type: 'boolean', name: 'track_certificate', nullable: true })
    trackCertificate: boolean;

    @Column({ type: 'boolean', name: 'course_certificate', nullable: true })
    courseCertificate: boolean;

    @Column({ type: 'boolean', name: 'track_in_order', nullable: true })
    trackInOrder: boolean;

    @Column({ type: 'boolean', name: 'featured', nullable: true })
    featured: boolean;

    @Column({ type: 'float', name: 'price', nullable: true })
    price: number;

    @Column({ type: 'float', name: 'discount_price', nullable: true })
    discountPrice: number;

    @Column({ type: 'date', name: 'publish_date', nullable: true })
    publishDate: any;

    @Column({ name: 'published_by', nullable: true })
    publishedBy: string;

    @OneToMany(type => Track, other => other.program)
    tracks: Track[];

    @OneToMany(type => RelLearnerProgram, other => other.program)
    relLearnerPrograms: RelLearnerProgram[];

    @OneToMany(type => RelIntakeProgram, other => other.program)
    relIntakePrograms: RelIntakeProgram[];

    @ManyToOne(type => Category)
    category: Category;

    //   @OneToMany((type) => UserProgramCertificate, (other) => other.program)
    //   userProgramCertificates: UserProgramCertificate[];

    //   @OneToMany((type) => RelCertificateProgram, (other) => other.program)
    //   relCertificatePrograms: RelCertificateProgram[];

    //   @OneToMany((type) => TransactionItem, (other) => other.program)
    //   transactionItems: TransactionItem[];

    //   @OneToMany((type) => RelCouponProgram, (other) => other.program)
    //   relCouponPrograms: RelCouponProgram[];

    //   @OneToMany((type) => RelProgramSession, (other) => other.program)
    //   relProgramSessions: RelProgramSession[];

    // constructor(
    //     slug: string,
    //     status: ProgramStatus,
    //     category?: Category,
    //     nameEn?: string,
    //     nameAr?: string,
    //     descriptionEn?: string,
    //     descriptionAr?: string,
    //     coverUrl?: string,
    //     introVideoUrl?: string,
    //     startDate?: any,
    //     endDate?: any,
    //     metaData?: string,
    //     trackCertificate: boolean = false,
    //     courseCertificate: boolean = false,
    //     trackInOrder: boolean = false,
    //     featured: boolean = false,
    //     price?: number,
    //     discountPrice?: number,
    //     publishDate?: any,
    //     publishedBy?: string,
    // ) {
    //     super();
    //     this.slug = slug;
    //     this.status = status;
    //     this.category = category;
    //     this.nameEn = nameEn ?? null;
    //     this.nameAr = nameAr ?? null;
    //     this.descriptionEn = descriptionEn ?? null;
    //     this.descriptionAr = descriptionAr ?? null;
    //     this.coverUrl = coverUrl ?? null;
    //     this.introVideoUrl = introVideoUrl ?? null;
    //     this.startDate = startDate ?? null;
    //     this.endDate = endDate ?? null;
    //     this.metaData = metaData ?? null;
    //     this.trackCertificate = trackCertificate ?? null;
    //     this.courseCertificate = courseCertificate ?? null;
    //     this.trackInOrder = trackInOrder ?? null;
    //     this.featured = featured ?? null;
    //     this.price = price ?? null;
    //     this.discountPrice = discountPrice ?? null;
    //     this.publishDate = publishDate ?? null;
    //     this.publishedBy = publishedBy ?? null;
    //     this.tracks = [];
    //     this.relLearnerPrograms = [];
    //     this.relIntakePrograms = [];
    //     // this.userProgramCertificates = [];
    //     // this.relCertificatePrograms = [];
    //     // this.transactionItems = [];
    //     // this.relCouponPrograms = [];
    //     // this.relProgramSessions = [];
    // }
}
