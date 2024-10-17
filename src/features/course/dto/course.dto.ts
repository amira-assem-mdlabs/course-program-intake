import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';
import { SectionDTO } from './section.dto';
import { RelCourseLearnerDTO } from './rel-course-learner.dto';
import { KeywordDTO } from './keyword.dto';
import { CategoryDTO } from './category.dto';
import { CourseStatus } from '../../../common/enumeration/course-status';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { RelIntakeCourseDTO } from '../../intake/dto/rel-intake-course.dto';
import { RelTrackCourseDTO } from '../../program/dto/rel-track-course.dto';
import { UserCompletedCourseDTO } from './user-completed-course.dto';
// import { UserCertificatesDTO } from './user-certificates.dto';
// import { RelCertificateCourseDTO } from './rel-certificate-course.dto';
// import { TransactionItemDTO } from './transaction-item.dto';
// import { RelCouponCourseDTO } from './rel-coupon-course.dto';
// import { RelProgramSessionDTO } from './rel-program-session.dto';
// import { RelCourseSessionDTO } from './rel-course-session.dto';
// import { CategoryDTO } from './category.dto';
// import { GradingSystemDTO } from './grading-system.dto';
// import { ILearner } from './user.dto';

export class CourseDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'slug field' })
    slug: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'name field' })
    name: string;

    @ApiProperty({ description: 'educationHours field', required: false })
    educationHours: number;

    @ApiProperty({ description: 'description field', required: false })
    description: string;

    @ApiProperty({ description: 'imageUrl field', required: false })
    imageUrl: string;

    @ApiProperty({ description: 'videoUrl field', required: false })
    videoUrl: string;

    @ApiProperty({ description: 'summary field', required: false })
    summary: string;

    @ApiProperty({ description: 'level field', required: false })
    level: number;

    @ApiProperty({ enum: CourseStatus, description: 'status enum field', required: false })
    status: CourseStatus;

    @ApiProperty({ description: 'isPublic field', required: false })
    isPublic: boolean;

    @ApiProperty({ description: 'allowCourseReview field', required: false })
    allowCourseReview: boolean;

    @ApiProperty({ description: 'showLecturer field', required: false })
    showLecturer: boolean;

    @ApiProperty({ description: 'showEnrollments field', required: false })
    showEnrollments: boolean;

    @ApiProperty({ description: 'publishDate field', required: false })
    publishDate: any;

    @ApiProperty({ description: 'publishedBy field', required: false })
    publishedBy: string;

    @ApiProperty({ description: 'endDate field', required: false })
    endDate: any;

    @ApiProperty({ description: 'lessonOrder field', required: false })
    lessonOrder: boolean;

    @ApiProperty({ description: 'price field', required: false })
    price: number;

    @ApiProperty({ description: 'dicountPrice field', required: false })
    dicountPrice: number;

    @ApiProperty({ type: () => SectionDTO, isArray: true, description: 'sections relationship' })
    sections: SectionDTO[];

    @ApiProperty({ type: () => RelCourseLearnerDTO, isArray: true, description: 'relCourseLearners relationship' })
    relCourseLearners: RelCourseLearnerDTO[];

    @ApiProperty({ type: () => RelTrackCourseDTO, isArray: true, description: 'relTrackCourses relationship' })
    relTrackCourses: RelTrackCourseDTO[];

    @ApiProperty({
        type: () => UserCompletedCourseDTO,
        isArray: true,
        description: 'userCompletedCourses relationship',
    })
    userCompletedCourses: UserCompletedCourseDTO[];

    @ApiProperty({ type: () => RelIntakeCourseDTO, isArray: true, description: 'relIntakeCourses relationship' })
    relIntakeCourses: RelIntakeCourseDTO[];

    @ApiProperty({ type: () => CategoryDTO, description: 'mainCategory relationship' })
    mainCategory: CategoryDTO;

    @ApiProperty({ type: () => CategoryDTO, description: 'subCategory relationship' })
    subCategory: CategoryDTO;

    @ApiProperty({ isArray: true, description: 'users relationship' })
    users: ILearner[];

    @ApiProperty({ type: () => KeywordDTO, isArray: true, description: 'keywords relationship' })
    keywords: KeywordDTO[];

    // @ApiProperty({ type: () => GradingSystemDTO, description: 'gradingSystem relationship' })
    // gradingSystem: GradingSystemDTO;

    // @ApiProperty({ type: () => UserCertificatesDTO, isArray: true, description: 'userCertificates relationship' })
    // userCertificates: UserCertificatesDTO[];

    // @ApiProperty({
    //     type: () => RelCertificateCourseDTO,
    //     isArray: true,
    //     description: 'relCertificateCourses relationship',
    // })
    // relCertificateCourses: RelCertificateCourseDTO[];

    // @ApiProperty({ type: () => TransactionItemDTO, isArray: true, description: 'transactionItems relationship' })
    // transactionItems: TransactionItemDTO[];

    // @ApiProperty({ type: () => RelCouponCourseDTO, isArray: true, description: 'relCouponCourses relationship' })
    // relCouponCourses: RelCouponCourseDTO[];

    // @ApiProperty({ type: () => RelProgramSessionDTO, isArray: true, description: 'relProgramSessions relationship' })
    // relProgramSessions: RelProgramSessionDTO[];

    // @ApiProperty({ type: () => RelCourseSessionDTO, isArray: true, description: 'relCourseSessions relationship' })
    // relCourseSessions: RelCourseSessionDTO[];

    // constructor(
    //     slug: string,
    //     name: string,
    //     status: CourseStatus,
    //     lessonOrder: boolean = false,
    //     isPublic: boolean = true,
    //     educationHours?: number,
    //     description?: string,
    //     imageUrl?: string,
    //     videoUrl?: string,
    //     summary?: string,
    //     level?: number,
    //     allowCourseReview?: boolean,
    //     showLecturer?: boolean,
    //     showEnrollments?: boolean,
    //     publishDate?: any,
    //     publishedBy?: string,
    //     endDate?: any,
    //     price?: number,
    //     dicountPrice?: number,
    //     sections: SectionDTO[] = [],
    //     relCourseLearners: RelCourseLearnerDTO[] = [],
    //     relTrackCourses: RelTrackCourseDTO[] = [],
    //     userCompletedCourses: UserCompletedCourseDTO[] = [],
    //     relIntakeCourses: RelIntakeCourseDTO[] = [],
    //     users: ILearner[] = [],
    //     keywords: KeywordDTO[] = [],
    //     mainCategory?: CategoryDTO,
    //     subCategory?: CategoryDTO,
    //     // userCertificates?: UserCertificatesDTO[],
    //     // relCertificateCourses?: RelCertificateCourseDTO[],
    //     // transactionItems?: TransactionItemDTO[],
    //     // relCouponCourses?: RelCouponCourseDTO[],
    //     // relProgramSessions?: RelProgramSessionDTO[],
    //     // relCourseSessions?: RelCourseSessionDTO[],
    //     // gradingSystem?: GradingSystemDTO
    // ) {
    //     super();
    //     this.slug = slug;
    //     this.name = name;
    //     this.educationHours = educationHours ?? null;
    //     this.description = description ?? null;
    //     this.imageUrl = imageUrl ?? null;
    //     this.videoUrl = videoUrl ?? null;
    //     this.summary = summary ?? null;
    //     this.level = level ?? null;
    //     this.status = status;
    //     this.isPublic = isPublic;
    //     this.allowCourseReview = allowCourseReview ?? null;
    //     this.showLecturer = showLecturer ?? null;
    //     this.showEnrollments = showEnrollments ?? null;
    //     this.publishDate = publishDate ?? null;
    //     this.publishedBy = publishedBy ?? null;
    //     this.endDate = endDate ?? null;
    //     this.lessonOrder = lessonOrder;
    //     this.price = price ?? null;
    //     this.dicountPrice = dicountPrice ?? null;
    //     this.sections = sections ?? null;
    //     this.relCourseLearners = relCourseLearners;
    //     // this.userCertificates = userCertificates ?? null;
    //     this.relTrackCourses = relTrackCourses;
    //     this.userCompletedCourses = userCompletedCourses;
    //     this.relIntakeCourses = relIntakeCourses;
    //     // this.relCertificateCourses = relCertificateCourses ?? null;
    //     // this.transactionItems = transactionItems ?? null;
    //     // this.relCouponCourses = relCouponCourses ?? null;
    //     // this.relProgramSessions = relProgramSessions ?? null;
    //     // this.relCourseSessions = relCourseSessions ?? null;
    //     this.mainCategory = mainCategory ?? null;
    //     this.subCategory = subCategory ?? null;
    //     this.users = users ?? null;
    //     this.keywords = keywords ?? null;
    //     // this.gradingSystem = gradingSystem ?? null;
    // }
}
