import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject, BadRequestException, Scope } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { PageRequest } from '../../../common/entities/pagination.entity';
import { CourseBasicInfo } from '../dto/course-basic-info.extend.dto';
import { CourseDTO } from '../dto/course.dto';
import { LessonDTO } from '../dto/lesson.dto';
import { SectionDTO } from '../dto/section.dto';
import { Course } from '../entities/course.entity';
import { RelCourseLearner } from '../entities/rel-course-learner.entity';
import { RelLessonLearner } from '../entities/rel-lesson-learner.entity';
import { CourseMapper } from '../mappers/course.mapper';
import { CourseRepository } from '../repositories/course.repository';
import { RelCourseLearnerRepository } from '../repositories/rel-course-learner.repository';
import { RelLessonLearnerRepository } from '../repositories/rel-lesson-learner.repository';
import { LessonService } from './lesson.service';
import { SectionService } from './section.service';


// import { CourseDTO } from '../service/dto/course.dto';
// import { CourseMapper } from '../service/mapper/course.mapper';
// import { CourseRepository } from '../repository/course.repository';
// import { CONNECTION } from '../utilities/multi-tenancy/tenancy.symbols';
// import { Course } from '../entities/course.entity';
// import { SectionExtendService } from './section.extend.service';
// import { SectionDTO } from './dto/section.dto';
// import { LessonExtendService } from './lesson.extend.service';
// import { LessonDTO } from './dto/lesson.dto';
// import { CourseStatus } from '../entities/enumeration/course-status';
// import { TenantUserDTO } from './dto/tenant-user.dto';
// import { PageRequest } from '../entities/base/pagination.entity';
// import { CourseBasicInfo } from './dto/course-basic-info.extend.dto';
// import { UserCertificatesRepository } from '../repository/user-certificates.repository';
// import { UserCertificates } from '../entities/user-certificates.entity';
// import { CourseGradableActivityDTO } from './dto/course-gradable-activities.dto';
// import { RelLessonLearnerService } from './rel-lesson-learner.extend.service';
// import { CourseExtendDTO } from './dto/course.extend.dto';
// import { RelLessonLearner } from '../entities/rel-lesson-learner.entity';
// import { RelLessonLearnerRepository } from '../repository/rel-lesson-learner.repository';
// import { RelCourseLearnerRepository } from '../repository/rel-course-learner.repository';
// import { RelCourseLearner } from '../entities/rel-course-learner.entity';
// import { CourseSummaryDTO } from './dto/course-summary.dto';
// import { LearnerNumeralsDTO } from './dto/learner-numerals.dto';

const relationshipNames: string[] = [];
relationshipNames.push('mainCategory');
relationshipNames.push('subCategory');
relationshipNames.push('users');
relationshipNames.push('keywords');
relationshipNames.push('relCourseLearners');
relationshipNames.push('gradingSystem');

@Injectable({ scope: Scope.REQUEST })
export class CourseService {
    logger = new Logger('CourseExtendService');
    private courseRepository: CourseRepository;
    // private userCertificatesRepository: UserCertificatesRepository;
    private relLessonLearnerRepository: RelLessonLearnerRepository;
    private relCourseLearnerRepository: RelCourseLearnerRepository;

    constructor(
        @Inject(CONNECTION) connection: Connection,
        private readonly sectionService: SectionService,
        private readonly lessonService: LessonService,
        // private readonly relLessonLearnerService: RelLessonLearnerService,
    ) {
        this.courseRepository = connection.getCustomRepository(CourseRepository);
        // this.userCertificatesRepository = connection.getRepository(UserCertificates);
        this.relLessonLearnerRepository = connection.getRepository(RelLessonLearner);
        this.relCourseLearnerRepository = connection.getRepository(RelCourseLearner);
    }

    async getCourseLessonQuizIds(id: number): Promise<number[]> {
        try {
            const filteredLessons = await this.courseRepository
                .createQueryBuilder('course')
                .leftJoin('course.sections', 'section')
                .leftJoin('section.lessons', 'lesson')
                .leftJoin('lesson.activities', 'activity')
                .leftJoin('activity.quizActivity', 'quiz_activity')
                .select('lesson.id as id')
                .where('course.id = :id', { id })
                .andWhere('quiz_activity.id IS NOT NULL')
                .getRawMany();

            const lessonQuizIds: number[] = [];
            filteredLessons.map(lesson => lessonQuizIds.push(lesson.id));
            return lessonQuizIds;
        } catch (error) {
            throw new HttpException('Error, course not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async fetchCourseStats(id: number): Promise<{
        numOfQuizes: number;
        numOfActivities: number;
        numOfLessons: number;
        numOfSections: number;
    }> {
        try {
            const query = this.courseRepository
                .createQueryBuilder('course')
                .leftJoin('course.sections', 'section')
                .leftJoin('section.lessons', 'lesson')
                .leftJoin('lesson.activities', 'activity')
                .leftJoin('activity.quizActivity', 'quiz_activity')
                .select([
                    'COUNT(DISTINCT section.id) AS sections',
                    'COUNT(DISTINCT lesson.id) AS lessons',
                    'COUNT(DISTINCT activity.id) AS activities',
                    'COUNT(DISTINCT quiz_activity.id) AS quizzes',
                ])
                .where('course.id = :id', { id })
                .groupBy('course.id');

            const result = await query.getRawOne();

            return {
                numOfSections: result.sections ? Number(result.sections) : 0,
                numOfLessons: result.lessons ? Number(result.lessons) : 0,
                numOfActivities: result.activities ? Number(result.activities) : 0,
                numOfQuizes: result.quizzes ? Number(result.quizzes) : 0,
            };
        } catch (error) {
            throw new HttpException('Error, course not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async findCourseCurriculum(slug: string, isAdmin: boolean = false): Promise<CourseDTO> {
        try {
            let query = this.courseRepository
                .createQueryBuilder('course')
                .where('course.slug = :slug', { slug })
                .leftJoinAndSelect('course.sections', 'section');

            if (!isAdmin) {
                query.leftJoinAndSelect('section.lessons', 'lesson').orderBy('lesson.order', 'ASC');
            }

            const course = await query.addOrderBy('section.order', 'ASC').getOne();

            if (!course) {
                throw new HttpException('Error, course not found!', HttpStatus.BAD_REQUEST);
            }
            return CourseMapper.fromEntityToDTO(course);
        } catch (error) {
            throw new HttpException('Error, course not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async getCourseCurriculumDetailes(slug: string, learnerId: number | null = null) {
        try {
            let query = this.courseRepository
                .createQueryBuilder('course')
                .where('course.slug = :slug', { slug })
                .leftJoinAndSelect('course.gradingSystem', 'gradingSystem')
                .leftJoinAndSelect('course.sections', 'section')
                .leftJoinAndSelect('section.lessons', 'lesson');

            if (learnerId) {
                query = query.leftJoinAndSelect(
                    'lesson.relLessonLearners',
                    'relLessonLearner',
                    'relLessonLearner.learner.id = :learnerId',
                    { learnerId },
                );
            }

            query = query.addOrderBy('section.order', 'ASC').addOrderBy('lesson.order', 'ASC');

            const course = await query.getOne();
            return course;
        } catch (error) {
            throw new HttpException('Error, course not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async getStudentSpecificCourseDetails(slug: string, studentId: number | null = null) {
        let query = this.relCourseLearnerRepository
            .createQueryBuilder('relCourseLearner')
            .innerJoin(
                'relCourseLearner.learner',
                'learner',
                'relCourseLearner.learnerId = learner.id AND learner.id = :studentId',
                { studentId },
            )
            .innerJoin(
                'relCourseLearner.course',
                'course',
                'relCourseLearner.courseId = course.id AND course.slug = :slug',
                { slug },
            )
            .leftJoin('learner.userCompletedCourses', 'completed_courses', 'completed_courses.courseId = course.id')
            .leftJoin('completed_courses.course', 'completed_course')
            .leftJoin('course.sections', 'section')
            .leftJoin('section.lessons', 'lesson')
            .leftJoin(
                'lesson.relLessonLearners',
                'rel_lesson_learner',
                '"rel_lesson_learner"."learnerId" = "relCourseLearner"."learnerId"',
            )
            .select('completed_courses.createdDate ', 'endDate')
            .addSelect('relCourseLearner.createdDate', 'startDate')
            .addSelect('completed_courses.score::FLOAT', 'score')
            .addSelect(
                `COALESCE(((COUNT(DISTINCT rel_lesson_learner.id)::FLOAT / NULLIF(COUNT(DISTINCT lesson.id), 0)::FLOAT) * 100.0)::DECIMAL(10,2),0)::FLOAT`,
                'progressPercentage',
            )
            .groupBy('completed_courses.createdDate')
            .addGroupBy('relCourseLearner.createdDate')
            .addGroupBy('completed_courses.score');

        return await query.getRawMany();
    }

    // async findCourseGradableActivities(id: number) {
    //     try {
    //         const courseResult = await this.courseRepository
    //             .createQueryBuilder('course')
    //             .leftJoinAndSelect('course.sections', 'section')
    //             .leftJoinAndSelect('section.lessons', 'lesson')
    //             .leftJoinAndSelect('lesson.activities', 'activity')
    //             .leftJoinAndSelect('activity.quizActivity', 'quizActivity')
    //             .leftJoinAndSelect('activity.assignmentActivity', 'assignmentActivity')
    //             .where('course.id = :id', { id })
    //             .andWhere('(quizActivity.id IS NOT NULL OR assignmentActivity.id IS NOT NULL)')
    //             .getOne();

    //         if (courseResult) {
    //             const course: CourseGradableActivityDTO = {
    //                 course: {
    //                     id: courseResult.id!,
    //                     name: courseResult.name,
    //                 },
    //                 sectionsGradableActivities: courseResult.sections.map(section => ({
    //                     id: section.id!,
    //                     name: section.name,
    //                     activities: {
    //                         assignments: section.lessons
    //                             .map(lesson => {
    //                                 const lessonAssignmentActivity = lesson.activities.find(
    //                                     activity => activity.assignmentActivity,
    //                                 );

    //                                 if (lessonAssignmentActivity) {
    //                                     return {
    //                                         lessonId: lesson.id,
    //                                         lessonName: lesson.name,
    //                                         ...(lessonAssignmentActivity && {
    //                                             data: lessonAssignmentActivity,
    //                                         }),
    //                                     };
    //                                 }
    //                             })
    //                             .filter(activity => activity),

    //                         quizzes: section.lessons
    //                             .map(lesson => {
    //                                 const lessonQuizActivity = lesson.activities.find(
    //                                     activity => activity.quizActivity,
    //                                 );

    //                                 if (lessonQuizActivity) {
    //                                     return {
    //                                         lessonId: lesson.id,
    //                                         lessonName: lesson.name,
    //                                         ...(lessonQuizActivity && { data: lessonQuizActivity }),
    //                                     };
    //                                 }
    //                             })
    //                             .filter(activity => activity),
    //                     },
    //                 })),
    //             };

    //             return course;
    //         }
    //     } catch (error) {
    //         throw new HttpException('COURSE_GRADABLE_ACTIVITIES_WERE_NOT_FOUND', HttpStatus.BAD_REQUEST);
    //     }
    // }

    async findAllProgramCourses(
        programCourses: number[],
        pageRequest: PageRequest,
        searchKeyword: string,
    ): Promise<[Course[], number]> {
        const query = this.courseRepository.createQueryBuilder('course').select('course');

        if (programCourses.length > 0) {
            query.where('course.id NOT IN (:...courseIds)', {
                courseIds: programCourses,
            });
        }

        if (searchKeyword) {
            query.andWhere('course.name ilike :name', { name: `%${searchKeyword}%` });
        }

        query
            .orderBy('course.id', 'ASC')
            .take(pageRequest.size)
            .skip(pageRequest.size * pageRequest.page);

        const courses = await query.getMany();
        const count = await query.getCount();

        return [courses, count];
    }

    // // TODO: MOVE TO ROOT PROJECT
    // async findByLecturer(
    //     id: number,
    //     courseStatus: string,
    //     pageRequest: PageRequest,
    // ): Promise<[CourseExtendDTO[], number]> {
    //     const query = this.courseRepository
    //         .createQueryBuilder('course')
    //         .leftJoinAndSelect('course.users', 'nhi_user')
    //         .leftJoinAndSelect('course.mainCategory', 'category')
    //         .leftJoinAndSelect('course.relCourseLearners', 'relCourseLearners')
    //         .where('nhi_user.id = :id', { id });

    //     if (courseStatus && courseStatus !== 'ALL') {
    //         query.andWhere(`course.status ${courseStatus === CourseStatus.PUBLISHED ? '=' : '!='} :courseStatus`, {
    //             courseStatus: CourseStatus.PUBLISHED,
    //         });
    //     }

    //     const lecturerCourses = await query
    //         .skip(+pageRequest.page * +pageRequest.size)
    //         .take(+pageRequest.size)
    //         .getMany();

    //     const courses: CourseExtendDTO[] = [];

    //     for (const course of lecturerCourses) {
    //         let progressRate = 0;

    //         const courseStatistics = await this.fetchCourseStats(course.id);

    //         const certificates = await this.userCertificatesRepository
    //             .createQueryBuilder('certificate')
    //             .leftJoinAndSelect('certificate.course', 'course')
    //             .where('course.id = :id', { id: course.id })
    //             .getCount();

    //         const learnersProgress = await this.relLessonLearnerRepository
    //             .createQueryBuilder('relLessonLearner')
    //             .leftJoin('relLessonLearner.lesson', 'lesson')
    //             .leftJoin('lesson.section', 'section')
    //             .leftJoin('section.course', 'course')
    //             .where('course.slug = :courseSlug', { courseSlug: course.slug })
    //             .getMany();

    //         const numberOfLearners = await this.relLessonLearnerRepository
    //             .createQueryBuilder('relLessonLearner')
    //             .leftJoinAndSelect('relLessonLearner.lesson', 'lesson')
    //             .leftJoinAndSelect('lesson.section', 'section')
    //             .leftJoinAndSelect('section.course', 'course')
    //             .where('course.slug = :courseSlug', { courseSlug: course.slug })
    //             .select('COUNT(DISTINCT relLessonLearner.learnerId)', 'learnerCount')
    //             .getRawOne();

    //         if (numberOfLearners && learnersProgress.length > 0) {
    //             const avgProgress =
    //                 learnersProgress.length / (numberOfLearners.learnerCount * courseStatistics.numOfLessons);
    //             progressRate = Math.round(avgProgress * 100);
    //         }

    //         courses.push({
    //             ...course,
    //             ...courseStatistics,
    //             numberOfEnrollments: course.relCourseLearners?.length || 0,
    //             numberOfCertificates: certificates,
    //             progressRate,
    //         });
    //     }

    //     const count = await query.getCount();

    //     return [courses, count];
    // }

    async findAllLecturerCoursesBasicInfo(id: number): Promise<CourseBasicInfo[]> {
        const result = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.users', 'nhi_user')
            .where('nhi_user.id = :id', { id })
            .getMany();

        const courses: CourseBasicInfo[] = [];

        result.forEach(courseInfo =>
            courses.push({
                id: courseInfo.id!,
                name: courseInfo.name,
            }),
        );

        return courses;
    }

    async findAllLecturerCourses(id: number): Promise<[Course[], number]> {
        const query = this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.users', 'nhi_user')
            .where('nhi_user.id = :id', { id })
            .leftJoinAndSelect('course.relCourseLearners', 'relCourseLearners')
            .leftJoinAndSelect('relCourseLearners.learner', 'learner')
            .leftJoinAndSelect('relCourseLearners.course', 'learnerCourse');
        const courses = await query.getMany();
        const coursesCount = await query.getCount();

        return [courses, coursesCount];
    }

    async findById(id: number): Promise<CourseDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.courseRepository.findOne(id, options);
        return CourseMapper.fromEntityToDTO(result!);
    }

    // async findByCourseId(id: number): Promise<DetailedCourseDTO> {
    //     const options = { relations: ['users', 'gradingSystem', 'gradingSystem.gradingSystemItems'] };

    //     const result = await this.courseRepository.findOne(id, options);

    //     if (result) {
    //         const sectionResults = await this.findSections(id);

    //         const lessonResults = await this.findLessons(sectionResults);

    //         const activitiesResults = await this.findActivities(lessonResults);
    //         const res = DeatailedCourseMapper.fromEntityToDTO({
    //             ...result,
    //             numOfActivities: activitiesResults.length,
    //             numOfLessons: lessonResults.length,
    //             numOfSections: sectionResults.length,
    //         });
    //         return res;
    //     }
    //     return;
    // }

    async findMainDetails(options: FindOneOptions<Course>): Promise<CourseDTO | undefined> {
        const result = await this.courseRepository.findOne(options);
        return CourseMapper.fromEntityToDTO(result!);
    }

    async findByFields(options: FindOneOptions<Course>): Promise<CourseDTO | undefined> {
        if (options.relations) {
            options.relations = [...relationshipNames, ...options.relations];
        } else {
            options.relations = relationshipNames;
        }
        const result = await this.courseRepository.findOne(options);
        return CourseMapper.fromEntityToDTO(result!);
    }

    async findAndCount(options: FindManyOptions<Course>): Promise<[CourseDTO[], number]> {
        options.relations = relationshipNames;

        const [courses, count] = await this.courseRepository.findAndCount(options);

        const courseDTOs = courses.map(course => CourseMapper.fromEntityToDTO(course));

        return [courseDTOs, count];
    }

    async save(courseDTO: CourseDTO, creator?: string, locale = 'ar'): Promise<CourseDTO | undefined> {
        const entity = CourseMapper.fromDTOtoEntity(courseDTO);
        entity.createdDate = new Date();
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.courseRepository.save(entity);
        const section1: SectionDTO = {
            slug: null,
            name: locale === 'en' ? 'First Section' : 'القسم الاول',
            description: locale === 'en' ? 'Description' : 'الوصف',
            course: result,
            order: null,
            lessons: [],
        };
        const section2: SectionDTO = {
            slug: null,
            name: locale === 'en' ? 'Second Section' : 'القسم الثاني ',
            description: locale === 'en' ? 'Description' : 'الوصف',
            course: result,
            order: null,
            lessons: [],
        };
        const firstSection = await this.sectionService.save(section1);
        const secondSection = await this.sectionService.save(section2);

        const lessons: LessonDTO[] = [
            {
                slug: null,
                name: locale === 'en' ? 'First Lesson' : 'الدرس الاول',
                description: locale === 'en' ? 'Description' : 'الوصف',
                section: firstSection,
                order: null,
                activities: [],
                relLessonLearners: [],
                // lessonSchedules: [],
            },
            {
                slug: null,
                name: locale === 'en' ? 'Second Lesson' : 'الدرس الثاني',
                description: locale === 'en' ? 'Description' : 'الوصف',
                section: firstSection,
                order: null,
                activities: [],
                relLessonLearners: [],
                // lessonSchedules: [],
            },
            {
                slug: null,
                name: locale === 'en' ? 'First Lesson' : 'الدرس الاول',
                description: locale === 'en' ? 'Description' : 'الوصف',
                section: secondSection,
                order: null,
                activities: [],
                relLessonLearners: [],
                // lessonSchedules: [],
            },
            {
                slug: null,
                name: locale === 'en' ? 'Second Lesson' : 'الدرس الثاني',
                description: locale === 'en' ? 'Description' : 'الوصف',
                section: secondSection,
                order: null,
                activities: [],
                relLessonLearners: [],
                // lessonSchedules: [],
            },
        ];

        for (const lesson of lessons) {
            await this.lessonService.save(lesson);
        }

        return CourseMapper.fromEntityToDTO(result);
    }

    async saveWithoutDummyData(courseDTO: CourseDTO, creator?: string): Promise<CourseDTO | undefined> {
        const entity = CourseMapper.fromDTOtoEntity(courseDTO);
        entity.createdDate = new Date();
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.courseRepository.save(entity);
        return CourseMapper.fromEntityToDTO(result);
    }

    async update(courseDTO: CourseDTO, updater: string | null = null): Promise<CourseDTO | undefined> {
        if (!courseDTO.id) throw new BadRequestException(`Course ID isn't found`);
        const previousCourse = await this.courseRepository.findOne(courseDTO.id);
        if (!previousCourse) throw new BadRequestException('Course not found');
        if (previousCourse.status !== courseDTO.status && courseDTO.status !== undefined) {
            courseDTO.publishedBy = updater;
        }
        const entity = CourseMapper.fromDTOtoEntity(courseDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.courseRepository.save(entity);
        return CourseMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.courseRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async findActiveCourses(options: FindManyOptions<CourseDTO>): Promise<[CourseDTO[], number]> {
        options.relations = ['mainCategory', 'users'];
        const resultList = await this.courseRepository.findAndCount(options);
        const coursesDTO: CourseDTO[] = resultList[0].map(course => CourseMapper.fromEntityToDTO(course));
        return [coursesDTO, resultList[1]];
    }

    // async getLearnerCourseProgressV2(learnerId: number, id: number, numOfLessons?: number): Promise<number> {
    //     let lessonsCount = numOfLessons;

    //     if (!lessonsCount) {
    //         const courseStats = await this.fetchCourseStatsV2({
    //             id,
    //             countLessons: true,
    //         });
    //         lessonsCount = courseStats.numOfLessons;
    //     }

    //     const learnerCompletedLessons = await this.relLessonLearnerService.getLearnerCompletedLessonsInCourse(
    //         id,
    //         learnerId,
    //     );

    //     return Math.floor((learnerCompletedLessons / lessonsCount) * 100);
    // }

    public async getCourseWithOrderedSections(courseId: number) {
        const result = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoinAndSelect('course.sections', 'section')
            .where('course.id = :courseId', { courseId })
            .orderBy('section.order', 'ASC')
            .getOne();

        return result;
    }

    // async getLearnerNumeralsReport(studentId: string): Promise<LearnerNumeralsDTO> {
    //     let query = this.relCourseLearnerRepository
    //         .createQueryBuilder('relCourseLearner')
    //         .innerJoin('relCourseLearner.learner', 'learner')
    //         .leftJoin('learner.relLearnerPrograms', 'program')
    //         .leftJoin('learner.userProgramCertificates', 'programCertificates')
    //         .leftJoin('learner.userCertificates', 'userCertificates')
    //         .leftJoin('relCourseLearner.course', 'course')
    //         .leftJoin('course.sections', 'section')
    //         .leftJoin('section.lessons', 'lesson')
    //         .leftJoin(
    //             'lesson.relLessonLearners',
    //             'rel_lesson_learner',
    //             '"rel_lesson_learner"."learnerId" = "relCourseLearner"."learnerId"',
    //         )
    //         .leftJoin(
    //             'learner.userCompletedCourses',
    //             'completed_courses',
    //             'completed_courses.learnerId = learner.id AND completed_courses.courseId =course.id',
    //         )
    //         .select('CAST(COUNT(DISTINCT course.id)AS INTEGER)', 'numberOfCourses')
    //         .addSelect('CAST(COUNT(DISTINCT program.id)AS INTEGER)', 'numberOfPrograms')
    //         .addSelect('CAST(COUNT(DISTINCT programCertificates.id) AS INTEGER)', 'numberOfCompletedPrograms')
    //         .addSelect(
    //             'CAST(COUNT(DISTINCT userCertificates.id) + COUNT(DISTINCT programCertificates.id) AS INTEGER)',
    //             'numberOfCertificates',
    //         )
    //         .addSelect(
    //             `COALESCE((COUNT(DISTINCT rel_lesson_learner.id)::FLOAT / NULLIF(COUNT(DISTINCT lesson.id), 0)::FLOAT) * 100.0::DECIMAL(10,2),0)::FLOAT`,
    //             'progressPercentage',
    //         )
    //         .addSelect(
    //             `COALESCE(((COUNT(DISTINCT completed_courses.id)::FLOAT / NULLIF(COUNT(DISTINCT course.id), 0)::FLOAT) * 100.0)::DECIMAL(10,2), 0)::FLOAT`,
    //             'percentageOfCompletedCourses',
    //         )
    //         .where('learner.id = :studentId', { studentId });

    //     const result = await query.getRawMany();

    //     return result[0];
    // }

    // async getLearnerCoursesReport(pageRequest: PageRequest, studentId: string): Promise<[CourseSummaryDTO[], number]> {
    //     let query = this.relCourseLearnerRepository
    //         //Firstly we will use the relation between the courses and the students
    //         .createQueryBuilder('relCourseLearner')
    //         //Then take only the ones that are related to the student
    //         .innerJoin(
    //             'relCourseLearner.learner',
    //             'learner',
    //             'relCourseLearner.learnerId = learner.id AND learner.id = :studentId',
    //             { studentId },
    //         )
    //         //Get all the relations between this student and all the intakes
    //         .leftJoin(
    //             'learner.relIntakeLearners',
    //             'rel_learner_intake',
    //             'rel_learner_intake.learnerId = learner.id AND rel_learner_intake.learnerId = :studentId',
    //             { studentId },
    //         )
    //         //Get the actual intakes this student is in
    //         .leftJoin('rel_learner_intake.intake', 'learner_intake')
    //         //Get the courses this student is in
    //         .innerJoin('relCourseLearner.course', 'course', 'relCourseLearner.courseId = course.id')
    //         //Get all the intakes this course has
    //         .leftJoin('course.relIntakeCourses', 'rel_course_intake', 'rel_course_intake.courseId = course.id')
    //         //Get the intersection between the intakes this student is in and the intakes this course has
    //         .leftJoin('rel_course_intake.intake', 'course_intake')
    //         //Get the completed courses this
    //         .leftJoin(
    //             'learner.userCompletedCourses',
    //             'completed_courses',
    //             'completed_courses.learnerId = learner.id AND completed_courses.courseId = course.id',
    //         )
    //         //Get the user certificates
    //         .leftJoin(
    //             'course.userCertificates',
    //             'user_certificates',
    //             'course.id =user_certificates.courseId AND user_certificates.userId = :studentId',
    //             { studentId },
    //         )
    //         .leftJoin('course.sections', 'section')
    //         .leftJoin('section.lessons', 'lesson')
    //         .leftJoin(
    //             'lesson.relLessonLearners',
    //             'rel_lesson_learner',
    //             '"rel_lesson_learner"."learnerId" = "relCourseLearner"."learnerId"',
    //         )
    //         .where(
    //             'relCourseLearner.learnerId = :studentId AND (learner_intake.id = course_intake.id OR course_intake.id IS NULL OR learner_intake IS NULL)',
    //             { studentId },
    //         )
    //         .select('course.name ', 'name')
    //         .addSelect('completed_courses.createdDate ', 'endDate')
    //         .addSelect('relCourseLearner.createdDate ', 'startDate')
    //         .addSelect('course_intake.name ', 'intakeName')
    //         .addSelect('user_certificates.id ', 'certificateId')
    //         .addSelect('course.id', 'courseId')
    //         .addSelect('course.slug', 'slug')
    //         .addSelect('completed_courses.score::FLOAT', 'score')
    //         .addSelect(
    //             `COALESCE(((COUNT(DISTINCT rel_lesson_learner.id)::FLOAT / NULLIF(COUNT(DISTINCT lesson.id), 0)::FLOAT) * 100.0)::DECIMAL(10,2), 0)::FLOAT`,
    //             'progressPercentage',
    //         )
    //         .groupBy('course.name')
    //         .addGroupBy('relCourseLearner.createdDate')
    //         .addGroupBy('completed_courses.createdDate')
    //         .addGroupBy('course_intake.name')
    //         .addGroupBy('completed_courses.score')
    //         .addGroupBy('course.id')
    //         .addGroupBy('user_certificates.id')
    //         .addGroupBy('course.slug')
    //         .orderBy('course.id');
    //     query.offset(Number(pageRequest.page * pageRequest.size)).limit(Number(pageRequest.size));

    //     const result = await query.getRawMany();
    //     const { count } = await this.relCourseLearnerRepository
    //         .createQueryBuilder('relCourseLearner')
    //         .select('CAST(COUNT(*) AS INTEGER)')
    //         .where('relCourseLearner.learnerId = :studentId', { studentId })
    //         .getRawOne();
    //     return [result, count || 0];
    // }

    async getTrackCourses(trackId: number): Promise<CourseDTO[]> {
        const courses = await this.courseRepository
            .createQueryBuilder('course')
            .leftJoin('course.relTrackCourses', 'relTrackCourses')
            .leftJoin('relTrackCourses.track', 'track')
            .where('track.id = :trackId', { trackId })
            .orderBy('relTrackCourses.order', 'ASC')
            .getMany();

        return courses.map(course => CourseMapper.fromEntityToDTO(course));
    }

    async getLessonCourse(lessonId: number): Promise<CourseDTO> {
        try {
            const result = await this.courseRepository
                .createQueryBuilder('course')
                .innerJoin('course.sections', 'section')
                .innerJoin('section.lessons', 'lesson', 'lesson.id = :lessonId', {
                    lessonId,
                })
                .getOne();

            if (!result) {
                throw new HttpException(`Course not found for lesson with ID ${lessonId}`, HttpStatus.NOT_FOUND);
            }

            return CourseMapper.fromEntityToDTO(result);
        } catch (error) {
            console.log('Error while retrieving course for lesson', lessonId, error);
            throw new HttpException('Failed to retrieve course information', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchCourseStatsV2(
        options: {
            slug?: string;
            id?: number;
            countSections?: boolean;
            countLessons?: boolean;
            countActivities?: boolean;
            countQuizzes?: boolean;
        } = {
            countSections: false,
            countLessons: false,
            countActivities: false,
            countQuizzes: false,
        },
    ): Promise<{
        numOfQuizzes: number;
        numOfActivities: number;
        numOfLessons: number;
        numOfSections: number;
    }> {
        try {
            const { slug, id } = options;
            let query = this.courseRepository.createQueryBuilder('course');
            if (!slug && !id) throw new HttpException('Invalid Course Slug or ID.', HttpStatus.BAD_REQUEST);
            if (slug) {
                query.where('course.slug = :slug', { slug });
            }
            if (id) {
                query.where('course.id = :id', { id });
            }

            query.leftJoin('course.sections', 'section');

            if (options.countSections) {
                query.addSelect('COUNT(DISTINCT section.id) AS sections');
            }

            if (options.countLessons || options.countActivities || options.countQuizzes) {
                query.leftJoin('section.lessons', 'lesson');
            }

            if (options.countLessons) {
                query.addSelect('COUNT(DISTINCT lesson.id) AS lessons');
            }

            if (options.countActivities || options.countQuizzes) {
                query.leftJoin('lesson.activities', 'activity');
            }

            if (options.countActivities) {
                query.addSelect('COUNT(DISTINCT activity.id) AS activities');
            }

            if (options.countQuizzes) {
                query
                    .leftJoin('activity.quizActivity', 'quiz_activity')
                    .addSelect('COUNT(DISTINCT quiz_activity.id) AS quizzes');
            }

            const result = await query.groupBy('course.id').cache(600000).getRawOne();

            return {
                numOfSections: Number(result.sections || 0),
                numOfLessons: Number(result.lessons || 0),
                numOfActivities: Number(result.activities || 0),
                numOfQuizzes: Number(result.quizzes || 0),
            };
        } catch (error) {
            console.error(error);
            throw new HttpException('Error fetching course statistics.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchTotalLessonsCount(courseId: number): Promise<number> {
        try {
            const { numOfLessons } = await this.fetchCourseStatsV2({
                id: courseId,
                countLessons: true,
            });
            return numOfLessons;
        } catch (error) {
            this.logger.error('Failed to fetch total lessons count', error.message);
            throw new HttpException('Failed to fetch course statistics', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchProgramCourses(options: {
        pageRequest: PageRequest;
        programId: number;
    }): Promise<{ data: CourseDTO[]; total: number }> {
        const { pageRequest, programId } = options;
        const { page, size, sort } = pageRequest;
        try {
            const [results, count] = await this.courseRepository
                .createQueryBuilder('course')
                .innerJoin('course.relTrackCourses', 'relTrackCourses')
                .innerJoin('relTrackCourses.track', 'track')
                .innerJoin('track.program', 'program', 'track.programId = :programId', {
                    programId,
                })
                .orderBy(`course.${sort.property}`, sort.direction === 'DESC' ? 'DESC' : 'ASC')
                .skip(page * size)
                .take(size)
                .getManyAndCount();

            return {
                data: results,
                total: count,
            };
        } catch (error) {
            console.error('Error fetching program courses:', error);
            throw new Error('Error fetching program courses');
        }
    }

    async findRelCourseByCourseIdAndLearnerID(user: object, course: object): Promise<RelCourseLearner | undefined> {
        return this.relCourseLearnerRepository.findOne({
            where: { learner: user, course: course },
        });
    }
    async addCourseLearnerIfNotExists(user: object, course: object): Promise<RelCourseLearner> {
        // Check if the record exists
        const existingRecord = await this.findRelCourseByCourseIdAndLearnerID(user, course);

        if (existingRecord) {
            return existingRecord;
        }

        // If it doesn't exist, insert a new record
        const newRecord = this.relCourseLearnerRepository.create({
            learner: user,
            course: course,
        });

        return this.relCourseLearnerRepository.save(newRecord);
    }

    async isLearnerEnrolled(learnerId: number, slug: string): Promise<{ enrolled: number }> {
        let query = this.relCourseLearnerRepository
            .createQueryBuilder('relCourseLearner')
            .innerJoin(
                'relCourseLearner.learner',
                'learner',
                'relCourseLearner.learnerId = learner.id AND learner.id = :learnerId',
                { learnerId },
            )
            .innerJoin(
                'relCourseLearner.course',
                'course',
                'relCourseLearner.courseId = course.id AND course.slug = :slug',
                { slug },
            )
            .select('COUNT(relCourseLearner.id)::INTEGER', 'enrolled')
            .getRawOne();
        return query;
    }
}
