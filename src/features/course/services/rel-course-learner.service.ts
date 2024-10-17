import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject, BadRequestException } from '@nestjs/common';
import { Brackets, Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { isDate } from 'util';
import { PageRequest } from '../../../common/entities/pagination.entity';
import { IntakeCompletionStatus } from '../../../common/enumeration/intake-completion-status';
import { SearchCategory } from '../../../common/enumeration/search-category';
import { RelIntakeLearnerHistory } from '../../intake/entities/rel-intake-learner-history.entity';
import { RelIntakeLearnerHistoryRepository } from '../../intake/repositories/rel-intake-learner-history.repository';
import { RelIntakeLearnerRepository } from '../../intake/repositories/rel-intake-learner.repository';
import { IntakeService } from '../../intake/services/intake.extend.service';
import { RelIntakeLearnerService } from '../../intake/services/rel-intake-learner.extend.service';
import { RelLearnerProgramService } from '../../program/services/rel-learner-program.extend.service';
import { CourseDTO } from '../dto/course.dto';
import { LearnerCourseDTO } from '../dto/learnerCourseDto';
import { RelCourseLearnerDTO } from '../dto/rel-course-learner.dto';
import { Activity } from '../entities/activity.entity';
import { RelCourseLearner } from '../entities/rel-course-learner.entity';
import { RelCourseLearnerMapper } from '../mappers/rel-course-learner.mapper';
import { ActivityRepository } from '../repositories/activity.repository';
import { RelCourseLearnerRepository } from '../repositories/rel-course-learner.repository';
import { CourseService } from './course.service';
import { QuizAttemptService } from './quiz-attempt.extend.service';
import { RelAssignmentLearnerService } from './rel-assignment-learner.extend.service';
import { RelLessonLearnerService } from './rel-lesson-learner.extend.service';
import { ILearner } from '../../../common/interfaces/learner.interface';

const relationshipNames = [];
relationshipNames.push('learner');
relationshipNames.push('course');

@Injectable()
export class RelCourseLearnerService {
    logger = new Logger('RelCourseLearnerService');

    private relCourseLearnerRepository: RelCourseLearnerRepository;
    private relIntakeLearnerRepository: RelIntakeLearnerRepository;
    private activityRepository: ActivityRepository;
    private relIntakeLearnerHistoryRepository: RelIntakeLearnerHistoryRepository;

    constructor(
        @Inject(CONNECTION) connection: Connection,
        private readonly courseService: CourseService,
        private readonly intakeService: IntakeService,
        private readonly quizAttemptService: QuizAttemptService,
        private readonly relLessonLearnerService: RelLessonLearnerService,
        private readonly relLearnerProgramService: RelLearnerProgramService,
        private readonly relIntakeLearnerService: RelIntakeLearnerService,
        private readonly relAssignmentLearnerService: RelAssignmentLearnerService,
    ) {
        if (connection) {
            this.relCourseLearnerRepository = connection.getRepository(RelCourseLearner);
            this.activityRepository = connection.getRepository(Activity);
            this.relIntakeLearnerRepository = connection.getCustomRepository(RelIntakeLearnerRepository);
            this.relIntakeLearnerHistoryRepository = connection.getRepository(RelIntakeLearnerHistory);
        }
    }

    async findById(id: number): Promise<RelCourseLearnerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relCourseLearnerRepository.findOne(id, options);
        return RelCourseLearnerMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelCourseLearnerDTO>): Promise<RelCourseLearnerDTO | undefined> {
        const result = await this.relCourseLearnerRepository.findOne(options);
        return RelCourseLearnerMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelCourseLearnerDTO>): Promise<[RelCourseLearnerDTO[], number]> {
        options.relations = relationshipNames;
        const [result, count] = await this.relCourseLearnerRepository.findAndCount(options);
        const relCourseLearnerDTO: RelCourseLearnerDTO[] = result.map(relCourseLearner =>
            RelCourseLearnerMapper.fromEntityToDTO(relCourseLearner),
        );

        return [relCourseLearnerDTO, count];
    }

    async save(relCourseLearnerDTO: RelCourseLearnerDTO, creator?: string): Promise<RelCourseLearnerDTO | undefined> {
        const entity = RelCourseLearnerMapper.fromDTOtoEntity(relCourseLearnerDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relCourseLearnerRepository.save(entity);
        return RelCourseLearnerMapper.fromEntityToDTO(result);
    }

    async saveWithAvailableIntake(
        relCourseLearnerDTO: RelCourseLearnerDTO,
        creator?: string,
    ): Promise<RelCourseLearnerDTO | undefined> {
        try {
            let course = relCourseLearnerDTO.course;
            if (!course.slug) {
                course = await this.courseService.findMainDetails({ where: { id: course.id } });
            }

            const { intakesCount, currentIntake } = await this.intakeService.getCourseOrProgramIntakes(
                course.slug,
                'COURSE',
            );
            const courseHasIntakes = intakesCount > 0;

            let enrolledIntake = null;
            if (courseHasIntakes && currentIntake) {
                enrolledIntake = await this.relIntakeLearnerService.save(
                    { intake: currentIntake, learner: relCourseLearnerDTO.learner },
                    creator,
                );
            }

            if (!courseHasIntakes || enrolledIntake) {
                return await this.save(relCourseLearnerDTO, creator);
            }

            throw new HttpException('Intake not found or enrollment failed', HttpStatus.BAD_REQUEST);
        } catch (error) {
            throw new HttpException('Failed to process request: ' + error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(relCourseLearnerDTO: RelCourseLearnerDTO, updater?: string): Promise<RelCourseLearnerDTO | undefined> {
        const entity = RelCourseLearnerMapper.fromDTOtoEntity(relCourseLearnerDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relCourseLearnerRepository.save(entity);
        return RelCourseLearnerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relCourseLearnerRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async findAndCountLearnerCourses(
        learnerId: number,
        page: number,
        size: number,
    ): Promise<[RelCourseLearnerDTO[], number]> {
        const query = this.relCourseLearnerRepository
            .createQueryBuilder('relCourseLearner')
            .leftJoin('relCourseLearner.learner', 'learner')
            .leftJoinAndSelect('relCourseLearner.course', 'course')
            .leftJoinAndSelect('course.mainCategory', 'mainCategory')
            .where('learner.id = :learnerId', { learnerId });

        const count = await query.getCount();

        const results = await query.orderBy('relCourseLearner.id', 'DESC').take(size).skip(page).getMany();

        return [results, count];
    }

    async isLearnerEnrolledInCourse(learnerId: number, courseId: number): Promise<boolean> {
        try {
            const enrolled = await this.relCourseLearnerRepository
                .createQueryBuilder('relCourseLearner')
                .leftJoin('relCourseLearner.learner', 'learner')
                .leftJoin('relCourseLearner.course', 'course')
                .where('course.id = :courseId', { courseId })
                .andWhere('learner.id = :learnerId ', { learnerId })
                .getOne();

            return !!enrolled;
        } catch (error) {
            throw new HttpException('Error, relCourseLearner not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async isLearnerCompletedCourse(learnerId: number, id: number): Promise<boolean> {
        const courseStatistics = await this.courseService.fetchCourseStats(id);
        const learnerCompletedLessons = await this.relLessonLearnerService.getLearnerCompletedLessonsInCourse(
            id,
            learnerId,
        );
        return courseStatistics.numOfLessons === learnerCompletedLessons;
    }

    async assignCoursesToLearner(learner: ILearner, courses: CourseDTO[]): Promise<LearnerCourseDTO[]> {
        const coursesDTO: LearnerCourseDTO[] = [];
        for (const course of courses) {
            const courseStatistics = await this.courseService.fetchCourseStats(course.id);
            const courseDTO = { ...course, ...courseStatistics };
            let enrolledIntake = null;
            let enrolled = await this.isLearnerEnrolledInCourse(learner.id, courseDTO.id);
            if (!enrolled) {
                const learnerEnrolledInProgram =
                    await this.relLearnerProgramService.isLearnerEnrolledInProgramContainsCourse(
                        learner.id,
                        courseDTO.slug,
                    );

                if (learnerEnrolledInProgram) {
                    enrolled = true;
                    enrolledIntake = await this.relIntakeLearnerService.findIntakeByLearner({
                        learnerId: learner.id,
                        programId: learnerEnrolledInProgram.program.id,
                    });
                }
            } else {
                enrolledIntake = await this.relIntakeLearnerService.findIntakeByLearner({
                    learnerId: learner.id,
                    courseId: course.id,
                });
            }
            const courseIntakes = await this.intakeService.getCourseOrProgramIntakes(course.slug, 'COURSE');
            coursesDTO.push({
                ...courseDTO,
                ...courseIntakes,
                enrolled,
                enrolledIntake,
            });
        }

        return coursesDTO;
    }

    // async getLearnerCourseGrade(learner: ILearner, course: CourseDTO) {
    //     const gradingSystem = course.gradingSystem;
    //     let learnerGradeWeight: number = 0;
    //     let totalWeight: number = 0;
    //     try {
    //         for (const gradingSystemItem of gradingSystem.gradingSystemItems) {
    //             totalWeight += gradingSystemItem.weight;
    //             if (gradingSystemItem.type === GradingSystemItemType.ASSIGNMENT) {
    //                 const activity = await this.activityRepository
    //                     .createQueryBuilder('activity')
    //                     .innerJoinAndSelect('activity.assignmentActivity', 'assignmentActivity')
    //                     .where('activity.id = :activityId', { activityId: gradingSystemItem.itemId })
    //                     .getOne();

    //                 if (activity) {
    //                     const learnerAssignment = await this.relAssignmentLearnerService.findByFields({
    //                         where: { assignment: { id: activity.assignmentActivity.id }, learner: { id: learner.id } },
    //                         relations: ['assignment'],
    //                     });

    //                     if (learnerAssignment && learnerAssignment.grade) {
    //                         learnerGradeWeight +=
    //                             (learnerAssignment.grade / learnerAssignment.assignment.grade) *
    //                             gradingSystemItem.weight;
    //                     }
    //                 }
    //             }
    //             if (gradingSystemItem.type === GradingSystemItemType.QUIZ) {
    //                 const activity = await this.activityRepository
    //                     .createQueryBuilder('activity')
    //                     .innerJoinAndSelect('activity.quizActivity', 'quizActivity')
    //                     .where('activity.id = :activityId', { activityId: gradingSystemItem.itemId })
    //                     .getOne();

    //                 if (activity) {
    //                     const learnerQuizMaxScore = await this.quizAttemptService.getLearnerQuizMaxScore(
    //                         learner,
    //                         activity.quizActivity.id,
    //                     );

    //                     if (learnerQuizMaxScore && learnerQuizMaxScore.score) {
    //                         learnerGradeWeight +=
    //                             (Math.round(learnerQuizMaxScore.score) / 100) * gradingSystemItem.weight;
    //                     }
    //                 }
    //             }
    //         }

    //         return Math.round((learnerGradeWeight / totalWeight) * 100);
    //     } catch (error) {
    //         console.log('error', error);
    //         throw new HttpException('Error, relCourseLearner not found!', HttpStatus.BAD_REQUEST);
    //     }
    // }

    // async getStudentsProgressReport(options: {
    //     pageRequest: PageRequest;
    //     courseId: number;
    //     intakeId?: number;
    //     intakeStatus?: IntakeCompletionStatus;
    //     formattedCompeletionDateFrom?: Date;
    //     formattedCompeletionDateTo?: Date;
    //     CourseStatus?: string;
    //     coursePercentageRange?: string;
    //     search: { category: SearchCategory; keyword: string };
    // }): Promise<[ReportCourseProgressDTO[], number]> {
    //     const {
    //         pageRequest,
    //         courseId,
    //         intakeId,
    //         intakeStatus,
    //         search,
    //         formattedCompeletionDateFrom,
    //         formattedCompeletionDateTo,
    //         CourseStatus,
    //         coursePercentageRange,
    //     } = options;

    //     const totalLessonsCount = await this.courseService.fetchTotalLessonsCount(courseId);

    //     const baseQuery = this.constructBaseQuery(courseId, intakeId, intakeStatus);

    //     const { data, totalCount } = await this.executeDataQuery(
    //         baseQuery,
    //         totalLessonsCount,
    //         pageRequest,
    //         search,
    //         formattedCompeletionDateFrom,
    //         formattedCompeletionDateTo,
    //         CourseStatus,
    //         coursePercentageRange,
    //         intakeStatus,
    //     );

    //     return [data, totalCount];
    // }

    // async exportStudentsProgressReport(options: {
    //     pageRequest: PageRequest;
    //     courseId: number;
    //     intakeId?: number;
    //     intakeStatus?: IntakeCompletionStatus;
    //     formattedCompeletionDateFrom?: Date;
    //     formattedCompeletionDateTo?: Date;
    //     CourseStatus?: string;
    //     coursePercentageRange?: string;
    //     search: { category: SearchCategory; keyword: string };
    // }): Promise<ReportCourseProgressDTO[]> {
    //     const {
    //         pageRequest,
    //         courseId,
    //         intakeId,
    //         intakeStatus,
    //         search,
    //         CourseStatus,
    //         formattedCompeletionDateFrom,
    //         coursePercentageRange,
    //         formattedCompeletionDateTo,
    //     } = options;

    //     const totalLessonsCount = await this.courseService.fetchTotalLessonsCount(courseId);

    //     const baseQuery = this.constructBaseQuery(courseId, intakeId, intakeStatus);
    //     const { data, totalCount } = await this.executeDataQuery(
    //         baseQuery,
    //         totalLessonsCount,
    //         pageRequest,
    //         search,
    //         formattedCompeletionDateFrom,
    //         formattedCompeletionDateTo,
    //         CourseStatus,
    //         coursePercentageRange,
    //     );

    //     return data;
    // }

    private constructBaseQuery(courseId: number, intakeId?: number, intakeStatus?: IntakeCompletionStatus) {
        let baseQuery;

        if (intakeId && intakeStatus === IntakeCompletionStatus.PASSED) {
            baseQuery = this.relIntakeLearnerRepository
                .createQueryBuilder('relIntakeLearner')
                .innerJoin('relIntakeLearner.learner', 'learner')
                .innerJoin('relIntakeLearner.intake', 'intake', 'intake.id = :intakeId', { intakeId })
                .innerJoin('intake.relIntakeCourses', 'relIntakeCourses')
                .innerJoin('relIntakeCourses.course', 'course');
        } else if (intakeId && intakeStatus === IntakeCompletionStatus.FAILED) {
            baseQuery = this.relIntakeLearnerHistoryRepository
                .createQueryBuilder('relIntakeLearnerHistory')
                .innerJoin('relIntakeLearnerHistory.learner', 'learner')
                .innerJoin('relIntakeLearnerHistory.intake', 'intake', 'intake.id = :intakeId', { intakeId })
                .innerJoin('intake.relIntakeCourses', 'relIntakeCourses')
                .innerJoin('relIntakeCourses.course', 'course');
        } else {
            baseQuery = this.relCourseLearnerRepository
                .createQueryBuilder('relCourseLearner')
                .innerJoin('relCourseLearner.learner', 'learner')
                .innerJoin('relCourseLearner.course', 'course', 'course.id = :courseId', { courseId });
        }

        return baseQuery
            .leftJoin(
                'course.userCompletedCourses',
                'userCompletedCourse',
                'userCompletedCourse.courseId = course.id AND userCompletedCourse.learnerId = learner.id',
            )
            .innerJoin('course.sections', 'section')
            .innerJoin('section.lessons', 'lesson')
            .leftJoin(
                'lesson.relLessonLearners',
                'relLessonLearner',
                'relLessonLearner.lessonId = lesson.id AND relLessonLearner.learnerId = learner.id',
            );
    }

    private async executeDataQuery(
        baseQuery: any,
        totalLessonsCount: number,
        pageRequest: PageRequest,
        search?: { category?: SearchCategory; keyword?: string },
        formattedCompeletionDateFrom?: Date,
        formattedCompeletionDateTo?: Date,
        courseStatus?: string,
        coursePercentageRange?: string,
        intakeStatus?: string,
    ) {
        try {
            if (search.keyword) {
                if (search.category === SearchCategory.USER_NAME) {
                    baseQuery.andWhere(
                        new Brackets(qb => {
                            qb.where('learner.firstName ilike :firstName', {
                                firstName: `%${search.keyword}%`,
                            }).orWhere('learner.lastName ilike :lastName', { lastName: `%${search.keyword}%` });
                        }),
                    );
                } else if (search.category === SearchCategory.USER_EMAIL) {
                    baseQuery.andWhere('learner.login ilike :email', { email: `%${search.keyword}%` });
                } else {
                    baseQuery.andWhere(
                        new Brackets(qb => {
                            qb.where('learner.firstName ilike :firstName', { firstName: `%${search.keyword}%` })
                                .orWhere('learner.lastName ilike :lastName', { lastName: `%${search.keyword}%` })
                                .orWhere('learner.login ilike :email', { email: `%${search.keyword}%` });
                        }),
                    );
                }
            }

            if (
                formattedCompeletionDateFrom &&
                isDate(formattedCompeletionDateFrom) &&
                formattedCompeletionDateTo &&
                isDate(formattedCompeletionDateTo)
            ) {
                baseQuery.andWhere('userCompletedCourse.createdDate BETWEEN :start AND :end', {
                    start: formattedCompeletionDateFrom,
                    end: formattedCompeletionDateTo,
                });
            }
            if (courseStatus === 'COMPLETED' || courseStatus === 'NOTCOMPLETED') {
                const isCompleted = courseStatus === 'COMPLETED';
                baseQuery.andWhere(`userCompletedCourse.courseId ${isCompleted ? 'IS NOT NULL' : 'IS NULL'}`);
            }

            if (coursePercentageRange) {
                const [fromRange, toRange] = coursePercentageRange.split(',').map(Number);
                if (Number.isInteger(fromRange) && Number.isInteger(toRange)) {
                    baseQuery.having(
                        'ROUND(100.0 * COUNT(DISTINCT relLessonLearner.lessonId) / :totalLessonsCount, 2) BETWEEN :fromRange AND :toRange',
                        {
                            totalLessonsCount,
                            fromRange,
                            toRange,
                        },
                    );
                }
            }

            // Clone the base query for count query
            const totalCountResult = await baseQuery
                .clone()
                .select([`COUNT(DISTINCT relLessonLearner.lessonId) AS "completedLessonsCount"`])
                .groupBy('learner.id')
                .addGroupBy('userCompletedCourse.id')
                .getRawMany();

            // Paginated data query
            const paginatedDataQuery = baseQuery
                .clone()
                .setParameter('totalLessonsCount', totalLessonsCount)
                .select([
                    'learner.login AS "learnerEmail"',
                    'learner.firstName AS "learnerName"',
                    'userCompletedCourse.createdDate AS "courseCompletionDate"',
                    'userCompletedCourse.score AS "finalCourseScore"',
                    `COUNT(DISTINCT relLessonLearner.lessonId) AS "completedLessonsCount"`,
                ])
                .groupBy('learner.id')
                .addGroupBy('userCompletedCourse.id')
                .offset(Number(pageRequest.page * pageRequest.size))
                .limit(Number(pageRequest.size));

            if (intakeStatus === IntakeCompletionStatus.FAILED) {
                paginatedDataQuery
                    .addSelect(`relIntakeLearnerHistory.progress AS "courseCompletionPercentage"`)
                    .addGroupBy('relIntakeLearnerHistory.id');
            } else {
                paginatedDataQuery.addSelect(
                    `ROUND(100.0 * COUNT(DISTINCT relLessonLearner.lessonId) / :totalLessonsCount, 2) AS "courseCompletionPercentage"`,
                );
            }

            const paginatedData = await paginatedDataQuery.getRawMany();
            return {
                totalCount: totalCountResult.length,
                data: paginatedData,
            };
        } catch (error) {
            this.logger.error('Error executing data query', error);
            throw new HttpException('Failed to execute data query', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private constructSuccessfulLearnersQuery(courseId: number, intakeId?: number) {
        let query;

        if (intakeId) {
            query = this.relIntakeLearnerRepository
                .createQueryBuilder('relIntakeLearner')
                .innerJoin('relIntakeLearner.learner', 'learner')
                .innerJoin('relIntakeLearner.intake', 'intake', 'intake.id = :intakeId', { intakeId });
        } else {
            query = this.relCourseLearnerRepository
                .createQueryBuilder('relCourseLearner')
                .innerJoin('relCourseLearner.learner', 'learner')
                .where('relCourseLearner.courseId = :courseId', { courseId });
        }
        query
            .innerJoin('learner.userCertificates', 'userCertificate', 'userCertificate.courseId = :courseId', {
                courseId,
            })
            .select('COUNT(DISTINCT userCertificate.userId)', 'successfulLearners');

        return query;
    }

    public constructCompletionPercentageQuery(courseId: number, intakeId?: number) {
        let completionPercentagesSubquery;

        if (intakeId) {
            completionPercentagesSubquery = this.relIntakeLearnerRepository
                .createQueryBuilder('relIntakeLearner')
                .innerJoin('relIntakeLearner.learner', 'learner')
                .innerJoin('relIntakeLearner.intake', 'intake', 'intake.id = :intakeId', { intakeId })
                .innerJoin('intake.relIntakeCourses', 'relIntakeCourses')
                .innerJoin('relIntakeCourses.course', 'course');
        } else {
            completionPercentagesSubquery = this.relCourseLearnerRepository
                .createQueryBuilder('relCourseLearner')
                .innerJoin('relCourseLearner.learner', 'learner')
                .innerJoin('relCourseLearner.course', 'course', 'course.id =:courseId', { courseId });
        }

        completionPercentagesSubquery
            .innerJoin('course.sections', 'section')
            .innerJoin('section.lessons', 'lesson')
            .leftJoin(
                'lesson.relLessonLearners',
                'relLessonLearner',
                'relLessonLearner.lessonId = lesson.id AND relLessonLearner.learnerId = learner.id',
            )
            .select('learner.id', 'learnerId')
            .addSelect(`100.0 * COUNT(DISTINCT relLessonLearner.lessonId) / :totalLessonsCount AS completionPercentage`)
            .groupBy('learner.id');

        return completionPercentagesSubquery;
    }

    async getCourseAndIntakeStatistics(
        courseId: number,
        intakeId?: number,
        intakeStatus?: IntakeCompletionStatus,
    ): Promise<{
        numberOfEnrolledStudents: number;
        successfulLearners: number;
        scoreAvgPercentage: number;
        averageCompletion: number;
    }> {
        try {
            const totalLessonsCount = await this.courseService.fetchTotalLessonsCount(courseId);
            const successfulLearnersSubquery = this.constructSuccessfulLearnersQuery(courseId, intakeId);
            const completionPercentagesSubquery = this.constructCompletionPercentageQuery(courseId, intakeId);

            let baseQuery;

            let failedStudentsStatistics;
            if (intakeId) {
                baseQuery = this.relIntakeLearnerRepository
                    .createQueryBuilder('relIntakeLearner')
                    .innerJoin('relIntakeLearner.learner', 'learner')
                    .innerJoin('relIntakeLearner.intake', 'intake', 'intake.id = :intakeId', { intakeId })
                    .innerJoin('intake.relIntakeCourses', 'relIntakeCourses')
                    .innerJoin('relIntakeCourses.course', 'course');

                failedStudentsStatistics = await this.relIntakeLearnerHistoryRepository
                    .createQueryBuilder('relIntakeLearnerHistory')
                    .innerJoin('relIntakeLearnerHistory.learner', 'learner')
                    .innerJoin('relIntakeLearnerHistory.intake', 'intake', 'intake.id = :intakeId', { intakeId })
                    .innerJoin('intake.relIntakeCourses', 'relIntakeCourses')
                    .innerJoin('relIntakeCourses.course', 'course')
                    .select('course.id', 'courseId')
                    .addSelect('COUNT(DISTINCT learner.id)', 'numberOfEnrolledStudents')
                    .addSelect(`SUM(relIntakeLearnerHistory.score)`, 'scoreSum')
                    .addSelect(`SUM(relIntakeLearnerHistory.progress)`, 'progressSum')
                    .groupBy('course.id')
                    .getRawOne();
            } else {
                baseQuery = this.relCourseLearnerRepository
                    .createQueryBuilder('relCourseLearner')
                    .innerJoin('relCourseLearner.learner', 'learner')
                    .innerJoin('relCourseLearner.course', 'course', 'course.id = :courseId', { courseId });
            }
            baseQuery
                .leftJoin('course.gradingSystem', 'gradingSystem')
                .leftJoin(
                    'course.userCompletedCourses',
                    'userCompletedCourse',
                    'userCompletedCourse.courseId = course.id AND userCompletedCourse.learnerId = learner.id',
                )
                .select('course.id', 'courseId')
                .addSelect('COUNT(DISTINCT learner.id)', 'numberOfEnrolledStudents')

                .addSelect(`(${successfulLearnersSubquery.getQuery()})`, 'successfulLearners')
                .addSelect(`SUM(userCompletedCourse.score) AS "scoreSum"`)
                .addSelect(
                    `(SELECT SUM(sub.completionPercentage) FROM (${completionPercentagesSubquery.getQuery()}) AS sub)`,
                    'progressSum',
                )
                .groupBy('course.id')
                .setParameter('courseId', courseId)
                .setParameter('totalLessonsCount', totalLessonsCount);

            let statistics = await baseQuery.getRawOne();
            if (!statistics && !failedStudentsStatistics) throw new BadRequestException();

            if (!statistics) {
                statistics = failedStudentsStatistics;
                statistics.successfulLearners = 0;
            } else if (failedStudentsStatistics) {
                statistics.numberOfEnrolledStudents =
                    Number(statistics.numberOfEnrolledStudents) +
                    Number(failedStudentsStatistics.numberOfEnrolledStudents);
                statistics.scoreSum = Number(statistics.scoreSum) + Number(failedStudentsStatistics.scoreSum);
                statistics.progressSum = Number(statistics.progressSum) + Number(failedStudentsStatistics.progressSum);
            }

            statistics.scoreAvgPercentage = statistics.scoreSum / statistics.numberOfEnrolledStudents;
            statistics.averageCourseCompletion = statistics.progressSum / statistics.numberOfEnrolledStudents;

            return {
                numberOfEnrolledStudents: Number(statistics.numberOfEnrolledStudents),
                successfulLearners: Number(statistics.successfulLearners),
                scoreAvgPercentage: Math.round(Number(statistics.scoreAvgPercentage)),
                averageCompletion: Math.round(Number(statistics.averageCourseCompletion)),
            };
        } catch (error) {
            console.error('Error calculating statistics:', error);
            return {
                numberOfEnrolledStudents: 0,
                successfulLearners: 0,
                scoreAvgPercentage: 0,
                averageCompletion: 0,
            };
        }
    }
}
