import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Section } from './section.entity';
import { RelCourseLearner } from './rel-course-learner.entity';
import { RelTrackCourse } from '../../program/entities/rel-track-course.entity';
import { UserCompletedCourse } from './user-completed-course.entity';
import { CourseStatus } from '../../../common/enumeration/course-status';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { Keyword } from './keyword.entity';
import { RelIntakeCourse } from '../../intake/entities/rel-intake-course.entity';
import { Category } from './category.entity';
// import { UserCertificates } from './user-certificates.entity';
// import { TransactionItem } from './transaction-item.entity';
// import { RelCouponCourse } from './rel-coupon-course.entity';
// import { RelProgramSession } from './rel-program-session.entity';
// import { RelCourseSession } from './rel-course-session.entity';
// import { RelCertificateCourse } from './rel-certificate-course.entity';
// import { GradingSystem } from "./grading-system.entity";

@Entity('course')
export class Course extends BaseEntity {
    @Column({ name: 'slug', unique: true })
    slug: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ type: 'float', name: 'education_hours', nullable: true })
    educationHours: number;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @Column({ name: 'video_url', nullable: true })
    videoUrl: string;

    @Column({ name: 'summary', nullable: true })
    summary: string;

    @Column({ type: 'integer', name: 'level', nullable: true })
    level: number;

    @Column({ type: 'simple-enum', name: 'status', enum: CourseStatus })
    status: CourseStatus;

    @Column({ type: 'boolean', name: 'is_public', nullable: true })
    isPublic: boolean;

    @Column({ type: 'boolean', name: 'allow_course_review', nullable: true })
    allowCourseReview: boolean;

    @Column({ type: 'boolean', name: 'show_lecturer', nullable: true })
    showLecturer: boolean;

    @Column({ type: 'boolean', name: 'show_enrollments', nullable: true })
    showEnrollments: boolean;

    @Column({ type: 'date', name: 'publish_date', nullable: true })
    publishDate: any;

    @Column({ name: 'published_by', nullable: true })
    publishedBy: string;

    @Column({ type: 'date', name: 'end_date', nullable: true })
    endDate: any;

    @Column({ type: 'boolean', name: 'lesson_order', nullable: true })
    lessonOrder: boolean;

    @Column({ type: 'float', name: 'price', nullable: true })
    price: number;

    @Column({ type: 'float', name: 'dicount_price', nullable: true })
    dicountPrice: number;

    @OneToMany(type => Section, other => other.course)
    sections: Section[];

    @OneToMany(type => RelCourseLearner, other => other.course)
    relCourseLearners: RelCourseLearner[];

    @OneToMany(type => RelTrackCourse, other => other.course)
    relTrackCourses: RelTrackCourse[];

    @OneToMany(type => UserCompletedCourse, other => other.course)
    userCompletedCourses: UserCompletedCourse[];

    @OneToMany(type => RelIntakeCourse, other => other.course)
    relIntakeCourses: RelIntakeCourse[];

    @ManyToOne(type => Category)
    mainCategory: Category;

    @ManyToOne(type => Category)
    subCategory: Category;

    @ManyToMany('nhi_user')
    @JoinTable({
        name: 'rel_course__user',
        joinColumn: { name: 'course_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users: ILearner[];

    @ManyToMany(type => Keyword)
    @JoinTable({
        name: 'rel_course__keyword',
        joinColumn: { name: 'course_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'keyword_id', referencedColumnName: 'id' },
    })
    keywords: Keyword[];

    // @OneToOne(() => GradingSystem, (gradingSystem) => gradingSystem.course)
    // gradingSystem: GradingSystem;

    // @OneToMany(type => RelCertificateCourse, other => other.course)
    // relCertificateCourses: RelCertificateCourse[];

    // @OneToMany(type => UserCertificates, other => other.course)
    // userCertificates: UserCertificates[];

    // @OneToMany(type => TransactionItem, other => other.course)
    // transactionItems: TransactionItem[];

    // @OneToMany(type => RelCouponCourse, other => other.course)
    // relCouponCourses: RelCouponCourse[];

    // @OneToMany(type => RelProgramSession, other => other.course)
    // relProgramSessions: RelProgramSession[];

    // @OneToMany(type => RelCourseSession, other => other.course)
    // relCourseSessions: RelCourseSession[];

    // constructor(
    //     slug: string,
    //     name: string,
    //     status: CourseStatus,
    //     mainCategory?: Category,
    //     educationHours?: number,
    //     description?: string,
    //     imageUrl?: string,
    //     videoUrl?: string,
    //     summary?: string,
    //     level?: number,
    //     isPublic: boolean = false,
    //     allowCourseReview: boolean = false,
    //     showLecturer: boolean = false,
    //     showEnrollments: boolean = false,
    //     publishDate?: any,
    //     publishedBy?: string,
    //     endDate?: any,
    //     lessonOrder: boolean = false,
    //     price?: number,
    //     dicountPrice?: number,
    // ) {
    //     super();
    //     this.slug = slug;
    //     this.name = name;
    //     this.status = status;
    //     this.mainCategory = mainCategory ?? null;
    //     this.subCategory = null;
    //     this.educationHours = educationHours ?? null;
    //     this.description = description ?? null;
    //     this.imageUrl = imageUrl ?? null;
    //     this.videoUrl = videoUrl ?? null;
    //     this.summary = summary ?? null;
    //     this.level = level ?? null;
    //     this.isPublic = isPublic ?? null;
    //     this.allowCourseReview = allowCourseReview ?? null;
    //     this.showLecturer = showLecturer ?? null;
    //     this.showEnrollments = showEnrollments ?? null;
    //     this.publishDate = publishDate ?? null;
    //     this.publishedBy = publishedBy ?? null;
    //     this.endDate = endDate ?? null;
    //     this.lessonOrder = lessonOrder ?? null;
    //     this.price = price ?? null;
    //     this.dicountPrice = dicountPrice ?? null;
    //     this.sections = [];
    //     this.relTrackCourses = [];
    //     this.userCompletedCourses = [];
    //     this.relIntakeCourses = [];
    //     this.relCourseLearners = [];
    //     this.users = [];
    //     this.keywords = [];
    //     // this.relCertificateCourses = [];
    //     // this.userCertificates = [];
    //     // this.transactionItems = [];
    //     // this.relCouponCourses = [];
    //     // this.relProgramSessions = [];
    //     // this.relCourseSessions = [];
    // }
}
