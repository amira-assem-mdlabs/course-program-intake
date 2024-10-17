import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { TrackDTO } from './track.dto';
import { RelLearnerProgramDTO } from './rel-learner-program.dto';
import { ProgramStatus } from '../../../common/enumeration/program-status';
import { CategoryDTO } from '../../course/dto/category.dto';
import { RelIntakeProgramDTO } from '../../intake/dto/rel-intake-program.dto';
// import { UserProgramCertificateDTO } from './user-program-certificate.dto';
// import { RelCertificateProgramDTO } from './rel-certificate-program.dto';

// import { TransactionItemDTO } from './transaction-item.dto';
// import { RelCouponProgramDTO } from './rel-coupon-program.dto';
// import { RelProgramSessionDTO } from './rel-program-session.dto';

export class ProgramDTO extends BaseDTO {
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

    @ApiProperty({ description: 'coverUrl field', required: false })
    coverUrl: string;

    @ApiProperty({ description: 'introVideoUrl field', required: false })
    introVideoUrl: string;

    @ApiProperty({ description: 'startDate field', required: false })
    startDate: any;

    @ApiProperty({ description: 'endDate field', required: false })
    endDate: any;

    @ApiProperty({ description: 'metaData field', required: false })
    metaData: string;

    @ApiProperty({ enum: ProgramStatus, description: 'status enum field', required: false })
    status: ProgramStatus;

    @ApiProperty({ description: 'trackCertificate field', required: false })
    trackCertificate: boolean;

    @ApiProperty({ description: 'courseCertificate field', required: false })
    courseCertificate: boolean;

    @ApiProperty({ description: 'trackInOrder field', required: false })
    trackInOrder: boolean;

    @ApiProperty({ description: 'featured field', required: false })
    featured: boolean;

    @ApiProperty({ description: 'price field', required: false })
    price: number;

    @ApiProperty({ description: 'discountPrice field', required: false })
    discountPrice: number;

    @ApiProperty({ description: 'publishDate field', required: false })
    publishDate: any;

    @ApiProperty({ description: 'publishedBy field', required: false })
    publishedBy: string;

    @ApiProperty({ type: () => TrackDTO, isArray: true, description: 'tracks relationship', required: false })
    tracks: TrackDTO[];

    @ApiProperty({
        type: () => RelLearnerProgramDTO,
        isArray: true,
        description: 'relLearnerPrograms relationship',
        required: false,
    })
    relLearnerPrograms: RelLearnerProgramDTO[];

    @ApiProperty({
        type: () => RelIntakeProgramDTO,
        isArray: true,
        description: 'relIntakePrograms relationship',
        required: false,
    })
    relIntakePrograms: RelIntakeProgramDTO[];

    @ApiProperty({ type: () => CategoryDTO, description: 'category relationship', required: false })
    category: CategoryDTO;

    // @ApiProperty({
    //     type: () => UserProgramCertificateDTO,
    //     isArray: true,
    //     description: 'userProgramCertificates relationship',
    //     required: false,
    // })
    // userProgramCertificates: UserProgramCertificateDTO[] | null;

    // @ApiProperty({
    //     type: () => RelCertificateProgramDTO,
    //     isArray: true,
    //     description: 'relCertificatePrograms relationship',
    //     required: false,
    // })
    // relCertificatePrograms: RelCertificateProgramDTO[] | null;

    // @ApiProperty({
    //     type: () => TransactionItemDTO,
    //     isArray: true,
    //     description: 'transactionItems relationship',
    //     required: false,
    // })
    // transactionItems: TransactionItemDTO[] | null;

    // @ApiProperty({
    //     type: () => RelCouponProgramDTO,
    //     isArray: true,
    //     description: 'relCouponPrograms relationship',
    //     required: false,
    // })
    // relCouponPrograms: RelCouponProgramDTO[] | null;

    // @ApiProperty({
    //     type: () => RelProgramSessionDTO,
    //     isArray: true,
    //     description: 'relProgramSessions relationship',
    //     required: false,
    // })
    // relProgramSessions: RelProgramSessionDTO[] | null;

    // constructor(
    //     slug: string,
    //     status: ProgramStatus,
    //     trackCertificate: boolean = false,
    //     courseCertificate: boolean = false,
    //     trackInOrder: boolean = false,
    //     featured: boolean = false,
    //     nameEn?: string,
    //     nameAr?: string,
    //     descriptionEn?: string,
    //     descriptionAr?: string,
    //     coverUrl?: string,
    //     introVideoUrl?: string,
    //     startDate?: any,
    //     endDate?: any,
    //     metaData?: string,
    //     price?: number,
    //     discountPrice?: number,
    //     publishDate?: any,
    //     publishedBy?: string,
    //     tracks: TrackDTO[] = [],
    //     relLearnerPrograms: RelLearnerProgramDTO[] = [],
    //     relIntakePrograms: RelIntakeProgramDTO[] = [],
    //     category?: CategoryDTO,
    //     // userProgramCertificates?: UserProgramCertificateDTO[],
    //     // relCertificatePrograms?: RelCertificateProgramDTO[],
    //     // transactionItems?: TransactionItemDTO[],
    //     // relCouponPrograms?: RelCouponProgramDTO[],
    //     // relProgramSessions?: RelProgramSessionDTO[],
    // ) {
    //     super();
    //     this.slug = slug;
    //     this.nameEn = nameEn ?? null;
    //     this.nameAr = nameAr ?? null;
    //     this.descriptionEn = descriptionEn ?? null;
    //     this.descriptionAr = descriptionAr ?? null;
    //     this.coverUrl = coverUrl ?? null;
    //     this.introVideoUrl = introVideoUrl ?? null;
    //     this.startDate = startDate ?? null;
    //     this.endDate = endDate ?? null;
    //     this.metaData = metaData ?? null;
    //     this.status = status;
    //     this.trackCertificate = trackCertificate;
    //     this.courseCertificate = courseCertificate;
    //     this.trackInOrder = trackInOrder;
    //     this.featured = featured;
    //     this.price = price ?? null;
    //     this.discountPrice = discountPrice ?? null;
    //     this.publishDate = publishDate ?? null;
    //     this.publishedBy = publishedBy ?? null;
    //     this.tracks = tracks;
    //     this.relLearnerPrograms = relLearnerPrograms;
    //     this.relIntakePrograms = relIntakePrograms;
    //     this.category = category ?? null;
    //     // this.userProgramCertificates = userProgramCertificates ?? null;
    //     // this.relCertificatePrograms = relCertificatePrograms ?? null;
    //     // this.transactionItems = transactionItems ?? null;
    //     // this.relCouponPrograms = relCouponPrograms ?? null;
    //     // this.relProgramSessions = relProgramSessions ?? null;
    // }
}
