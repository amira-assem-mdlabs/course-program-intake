import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { isDate } from 'class-validator';
import { RelLearnerProgramDTO } from '../dto/rel-learner-program.dto';
import { IntakeCompletionStatus } from '../../../common/enumeration/intake-completion-status';
import { SearchCategory } from '../../../common/enumeration/search-category';
import { RelLearnerProgram } from '../entities/rel-learner-program.entity';
import { Track } from '../entities/track.entity';
import { ProgramRepository } from '../repositories/program.repository';
import { RelIntakeLearnerHistoryRepository } from '../../intake/repositories/rel-intake-learner-history.repository';
import { RelIntakeLearnerRepository } from '../../intake/repositories/rel-intake-learner.repository';
import { TrackRepository } from '../repositories/track.repository';
import { IntakeService } from '../../intake/services/intake.extend.service';
import { RelIntakeLearnerService } from '../../intake/services/rel-intake-learner.extend.service';
import { RelLearnerProgramMapper } from '../mappers/rel-learner-program.mapper';
import { CourseService } from '../../course/services/course.service';
import { PageRequest } from '../../../common/entities/pagination.entity';
import { RelIntakeLearnerHistory } from '../../intake/entities/rel-intake-learner-history.entity';
import { Program } from '../entities/program.entity';
import { RelLearnerProgramRepository } from '../repositories/rel-learner-program.repository';
import { ProgramService } from './program.service';

const relationshipNames = [];
relationshipNames.push('program');
relationshipNames.push('learner');

@Injectable()
export class RelLearnerProgramService {
    logger = new Logger('RelLearnerProgramSExtendService');
    private relLearnerProgramRepository: RelLearnerProgramRepository;
    private relIntakeLearnerRepository: RelIntakeLearnerRepository;
    private programRepository: ProgramRepository;
    private trackRepository: TrackRepository;
    private relIntakeLearnerHistoryRepository: RelIntakeLearnerHistoryRepository;

    constructor(
        @Inject(CONNECTION) connection: Connection,
        private readonly intakeService: IntakeService,
        private readonly relIntakeLearnerService: RelIntakeLearnerService,
        private readonly programService: ProgramService,
        private readonly courseService: CourseService,
    ) {
        if (connection) {
            this.relLearnerProgramRepository = connection.getRepository(RelLearnerProgram);
            this.programRepository = connection.getRepository(Program);
            this.relIntakeLearnerRepository = connection.getCustomRepository(RelIntakeLearnerRepository);
            this.trackRepository = connection.getRepository(Track);
            this.relIntakeLearnerHistoryRepository = connection.getRepository(RelIntakeLearnerHistory);
        }
    }

    async findById(id: number): Promise<RelLearnerProgramDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relLearnerProgramRepository.findOne(id, options);
        return RelLearnerProgramMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelLearnerProgramDTO>): Promise<RelLearnerProgramDTO | undefined> {
        const result = await this.relLearnerProgramRepository.findOne(options);
        return RelLearnerProgramMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelLearnerProgramDTO>): Promise<[RelLearnerProgramDTO[], number]> {
        options.relations = relationshipNames;
        const [results, count] = await this.relLearnerProgramRepository.findAndCount(options);
        const relLearnerProgramDTO: RelLearnerProgramDTO[] = results.map(relLearnerProgram =>
            RelLearnerProgramMapper.fromEntityToDTO(relLearnerProgram),
        );
        return [relLearnerProgramDTO, count];
    }

    async save(
        relLearnerProgramDTO: RelLearnerProgramDTO,
        creator?: string,
    ): Promise<RelLearnerProgramDTO | undefined> {
        const entity = RelLearnerProgramMapper.fromDTOtoEntity(relLearnerProgramDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relLearnerProgramRepository.save(entity);
        return RelLearnerProgramMapper.fromEntityToDTO(result);
    }

    async saveWithAvailableIntake(
        relLearnerProgramDTO: RelLearnerProgramDTO,
        creator?: string,
    ): Promise<RelLearnerProgramDTO | undefined> {
        let program = relLearnerProgramDTO.program;
        if (!program.slug) {
            program = await this.programService.findByFields({
                where: {
                    id: relLearnerProgramDTO.program.id,
                },
            });
        }
        const { intakesCount, currentIntake } = await this.intakeService.getCourseOrProgramIntakes(
            program.slug,
            'PROGRAM',
        );

        const programHasIntakes = intakesCount > 0;

        let enrolledIntake = null;
        if (programHasIntakes && currentIntake) {
            enrolledIntake = await this.relIntakeLearnerService.save(
                { intake: currentIntake, learner: relLearnerProgramDTO.learner },
                creator,
            );
        }
        if (!programHasIntakes || enrolledIntake) {
            return await this.save(relLearnerProgramDTO, creator);
        }
        return;
    }

    async update(
        relLearnerProgramDTO: RelLearnerProgramDTO,
        updater?: string,
    ): Promise<RelLearnerProgramDTO | undefined> {
        const entity = RelLearnerProgramMapper.fromDTOtoEntity(relLearnerProgramDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relLearnerProgramRepository.save(entity);
        return RelLearnerProgramMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relLearnerProgramRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async isLearnerEnrolledInProgramContainsCourse(
        learnerId: number,
        courseSlug: string,
    ): Promise<RelLearnerProgramDTO> {
        try {
            const relLearnerProgram = await this.relLearnerProgramRepository
                .createQueryBuilder('relLearnerProgram')
                .innerJoin('relLearnerProgram.learner', 'learner')
                .innerJoinAndSelect('relLearnerProgram.program', 'program')
                .innerJoinAndSelect('program.tracks', 'track')
                .innerJoin('track.relTrackCourses', 'relTrackCourse')
                .innerJoin('relTrackCourse.course', 'course')
                .where('course.slug = :courseSlug', { courseSlug })
                .andWhere('learner.id = :learnerId', { learnerId })
                .orderBy('relLearnerProgram.id', 'DESC')
                .getOne();

            return relLearnerProgram;
        } catch (error) {
            throw new HttpException('Error, relLearnerProgram not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async fetchProgramDetailsForLearnerCourse(learnerId: number, courseId: number): Promise<RelLearnerProgramDTO[]> {
        try {
            const relLearnerPrograms = await this.relLearnerProgramRepository
                .createQueryBuilder('relLearnerProgram')
                .leftJoin('relLearnerProgram.learner', 'learner')
                .leftJoinAndSelect('relLearnerProgram.program', 'program')
                .leftJoinAndSelect('program.tracks', 'track')
                .leftJoinAndSelect('track.relTrackCourses', 'relTrackCourse')
                .leftJoin('relTrackCourse.course', 'course')
                .where('course.id = :courseId', { courseId })
                .andWhere('learner.id = :learnerId', { learnerId })
                .getMany();

            if (relLearnerPrograms) {
                return relLearnerPrograms;
            }
            return;
        } catch (error) {
            throw new HttpException('Error, relLearnerProgram not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async isLearnerEnrolledInProgram(learnerId: number, programSlug: string): Promise<RelLearnerProgramDTO> {
        const relLearnerProgram = await this.relLearnerProgramRepository
            .createQueryBuilder('relLearnerProgram')
            .leftJoin('relLearnerProgram.learner', 'learner')
            .leftJoin('relLearnerProgram.program', 'program')
            .where('program.slug = :programSlug', { programSlug })
            .andWhere('learner.id = :learnerId', { learnerId })
            .getOne();
        return relLearnerProgram;
    }

    // async getStudentsProgramProgressReport(options: {
    //     pageRequest: PageRequest;
    //     programId: number;
    //     intakeId?: number;
    //     intakeStatus?: IntakeCompletionStatus;
    //     map?: boolean;
    //     programPercentageRange?: string;
    //     formattedCompeletionDateFrom?: Date;
    //     formattedCompeletionDateTo?: Date;
    //     programStatus?: string;
    //     search?: {
    //         category: string;
    //         keyword: string;
    //     };
    // }): Promise<[ReportProgramProgressDTO[], number]> {
    //     const {
    //         pageRequest,
    //         programId,
    //         intakeId,
    //         intakeStatus,
    //         map,
    //         search,
    //         programPercentageRange,
    //         formattedCompeletionDateFrom,
    //         formattedCompeletionDateTo,
    //         programStatus,
    //     } = options;

    //     const { learners, count } = await this.fetchLearners(
    //         programId,
    //         pageRequest,
    //         intakeId,
    //         intakeStatus,
    //         search,
    //         formattedCompeletionDateFrom,
    //         formattedCompeletionDateTo,
    //         programStatus,
    //         programPercentageRange,
    //     );

    //     if (intakeId && intakeStatus === IntakeCompletionStatus.FAILED) return [learners, count];

    //     if (!learners || learners.length === 0) return [[], 0];

    //     const learnersIds = learners.map(({ learnerId }) => learnerId);

    //     const data = await this.fetchProgramData(programId, learnersIds);

    //     let results = data;

    //     if (map) {
    //         results = StudentAchievementsMapper.fromEntityToDTO(data, learners);
    //     }

    //     return [results, count];
    // }

    // async exportsStudentsProgramProgressReport(options: {
    //     pageRequest: PageRequest;
    //     programId: number;
    //     intakeId?: number;
    //     intakeStatus?: IntakeCompletionStatus;
    //     map?: boolean;
    //     programPercentageRange?: string;
    //     formattedCompeletionDateFrom?: Date;
    //     formattedCompeletionDateTo?: Date;
    //     programStatus?: string;
    //     search?: {
    //         category: string;
    //         keyword: string;
    //     };
    // }): Promise<ReportProgramProgressDTO[]> {
    //     const {
    //         pageRequest,
    //         programId,
    //         intakeId,
    //         intakeStatus,
    //         map,
    //         search,
    //         programPercentageRange,
    //         formattedCompeletionDateFrom,
    //         formattedCompeletionDateTo,
    //         programStatus,
    //     } = options;
    //     const { learners } = await this.fetchLearners(
    //         programId,
    //         pageRequest,
    //         intakeId,
    //         intakeStatus,
    //         search,
    //         formattedCompeletionDateFrom,
    //         formattedCompeletionDateTo,
    //         programStatus,
    //         programPercentageRange,
    //     );
    //     if (!learners || learners.length === 0) return [];

    //     if (intakeId && intakeStatus === IntakeCompletionStatus.FAILED) return learners;

    //     const learnersIds = learners.map(({ learnerId }) => learnerId);

    //     const data = await this.fetchProgramData(programId, learnersIds);

    //     let results = data;

    //     if (map) {
    //         results = StudentAchievementsMapper.fromEntityToDTO(data, learners);
    //     }

    //     return results;
    // }

    private async fetchLearners(
        programId: number,
        pageRequest: PageRequest,
        intakeId?: number,
        intakeStatus?: IntakeCompletionStatus,
        search?: {
            category: string;
            keyword: string;
        },
        formattedCompeletionDateFrom?: Date,
        formattedCompeletionDateTo?: Date,
        programStatus?: string,
        programPercentageRange?: string,
    ) {
        const { numOfCourses } = await this.programService.fetchProgramStats(programId, {
            countCourses: true,
            countLessons: false,
        });

        // Base query with common filters
        let baseQuery = this.constructProgramBaseQuery({ programId, intakeId, intakeStatus });

        // Apply search filters
        if (search?.keyword) {
            const searchConditions =
                search.category === SearchCategory.USER_EMAIL
                    ? 'learner.login ilike :keyword'
                    : search.category === SearchCategory.USER_NAME
                      ? 'learner.firstName ilike :keyword OR learner.lastName ilike :keyword'
                      : 'learner.firstName ilike :keyword OR learner.lastName ilike :keyword OR learner.login ilike :keyword';

            baseQuery.andWhere(searchConditions, { keyword: `%${search.keyword}%` });
        }

        if ((formattedCompeletionDateFrom && formattedCompeletionDateTo) || programStatus) {
            baseQuery.leftJoin(
                'program.userProgramCertificates',
                'userProgramCertificates',
                `"userProgramCertificates"."programId" = "program"."id" AND "userProgramCertificates"."userId" = "learner"."id"`,
            );
        }

        if (
            formattedCompeletionDateFrom &&
            isDate(formattedCompeletionDateFrom) &&
            formattedCompeletionDateTo &&
            isDate(formattedCompeletionDateTo)
        ) {
            baseQuery.andWhere('userProgramCertificates.createdDate BETWEEN :start AND :end', {
                start: formattedCompeletionDateFrom,
                end: formattedCompeletionDateTo,
            });
        }

        if (programStatus === 'COMPLETED' || programStatus === 'NOTCOMPLETED') {
            const isCompleted = programStatus === 'COMPLETED';
            baseQuery.andWhere(
                isCompleted ? `"userProgramCertificates"."id" IS NOT NULL` : `"userProgramCertificates"."id" IS NULL`,
            );
        }

        if (programPercentageRange) {
            const [fromRange, toRange] = programPercentageRange.split(',').map(Number);
            if (Number.isInteger(fromRange) && Number.isInteger(toRange)) {
                baseQuery
                    .innerJoin('program.tracks', 'tracks')
                    .innerJoin('tracks.relTrackCourses', 'relTrackCourses')
                    .innerJoin('relTrackCourses.course', 'course')
                    .leftJoin(
                        'course.userCompletedCourses',
                        'userCompletedCourses',
                        'userCompletedCourses.courseId = course.id AND userCompletedCourses.learnerId = learner.id',
                    )
                    .groupBy('learner.id')
                    .having(
                        'ROUND(100.0 * COUNT(userCompletedCourses.id) / :numOfCourses, 2) BETWEEN :fromRange AND :toRange ',
                        {
                            numOfCourses,
                            fromRange,
                            toRange,
                        },
                    );
            }
        }

        // Stage 1: Get the total count of learners
        // TODO: temporary count fix
        const countResult = await baseQuery
            .clone()
            .select('learner.id AS "learnerId"')
            .groupBy('learner.id')
            .getRawMany();
        const totalCount = countResult.length;

        // Stage 2: Fetch paginated learner data
        const paginatedQuery = baseQuery
            .select([
                'learner.id AS "learnerId"',
                'learner.login AS "learnerEmail"',
                'learner.firstName AS "learnerName"',
            ])
            .groupBy('learner.id')
            .offset(Number(pageRequest.page * pageRequest.size))
            .limit(Number(pageRequest.size));
        if (intakeId && intakeStatus === IntakeCompletionStatus.FAILED) {
            paginatedQuery.addSelect(
                `COALESCE(relIntakeLearnerHistory.progress,0)::DECIMAL(10,2)`,
                'programCompletionPercentage',
            );
            paginatedQuery
                .addSelect(`COALESCE(relIntakeLearnerHistory.score,0)::DECIMAL(10,2)`, 'finalProgramScore')
                .andWhere('program.id =:programId', { programId })
                .addGroupBy('relIntakeLearnerHistory.id');
        }

        const learners = await paginatedQuery.getRawMany();

        return { learners, count: totalCount };
    }

    private async fetchProgramData(programId: number, learnersIds: number[]) {
        const query = this.programRepository
            .createQueryBuilder('program')
            .select([
                'learner.login AS "learnerEmail"',
                'learner.firstName AS "learnerName"',
                'course.name AS "courseName"',
                'course.id AS "courseId"',
                'userCompletedCourses.score AS "finalCourseScore"',
                'userCompletedCourses.createdDate AS "courseCompletionDate"',
                'ROUND(100.0 * COUNT(DISTINCT(relLessonLearners.lessonId)) / total_lessons.total_lessons_count, 2) AS "courseCompletionPercentage"',
            ])
            .innerJoin('program.tracks', 'tracks')
            .innerJoin('tracks.relTrackCourses', 'relTrackCourses')
            .innerJoin('relTrackCourses.course', 'course')
            .innerJoin('course.sections', 'section')
            .innerJoin('section.lessons', 'lesson')
            .innerJoin('lesson.relLessonLearners', 'relLessonLearners')
            .innerJoin('relLessonLearners.learner', 'learner')
            .leftJoin(
                'course.userCompletedCourses',
                'userCompletedCourses',
                'userCompletedCourses.courseId = course.id AND userCompletedCourses.learnerId = learner.id',
            )
            .leftJoin(
                subQuery => {
                    return subQuery
                        .select('course.id', 'course_id')
                        .addSelect('COUNT(lesson.id)', 'total_lessons_count')
                        .from('course', 'course')
                        .innerJoin('course.sections', 'section')
                        .innerJoin('section.lessons', 'lesson')
                        .groupBy('course.id')
                        .cache(600000);
                },
                'total_lessons',
                'total_lessons.course_id = course.id',
            )
            .where('program.id = :programId', { programId })
            .andWhere('learner.id IN (:...learnersIds)', { learnersIds })
            .groupBy('learner.id')
            .addGroupBy('course.id')
            .addGroupBy('userCompletedCourses.id')
            .addGroupBy('total_lessons.total_lessons_count');

        return await query.getRawMany();
    }

    private constructProgramBaseQuery(options: {
        programId: number;
        intakeId?: number;
        intakeStatus?: IntakeCompletionStatus;
    }) {
        const { programId, intakeId, intakeStatus } = options;
        let baseQuery;
        if (intakeId && intakeStatus === IntakeCompletionStatus.PASSED) {
            baseQuery = this.relIntakeLearnerRepository
                .createQueryBuilder('relIntakeLearner')
                .innerJoin('relIntakeLearner.learner', 'learner')
                .innerJoin('relIntakeLearner.intake', 'intake', 'intake.id = :intakeId', { intakeId })
                .innerJoin('intake.relIntakePrograms', 'relIntakePrograms')
                .innerJoin('relIntakePrograms.program', 'program', 'program.id = :programId', { programId });
        } else if (intakeId && intakeStatus === IntakeCompletionStatus.FAILED) {
            baseQuery = this.relIntakeLearnerHistoryRepository
                .createQueryBuilder('relIntakeLearnerHistory')
                .innerJoin('relIntakeLearnerHistory.learner', 'learner')
                .innerJoin('relIntakeLearnerHistory.intake', 'intake', 'intake.id = :intakeId', { intakeId })
                .innerJoin('intake.relIntakePrograms', 'relIntakePrograms')
                .innerJoin('relIntakePrograms.program', 'program', 'program.id = :programId', { programId });
        } else {
            baseQuery = this.relLearnerProgramRepository
                .createQueryBuilder('relLearnerProgram')
                .innerJoin('relLearnerProgram.learner', 'learner')
                .innerJoin('relLearnerProgram.program', 'program', 'program.id = :programId', { programId });
        }
        return baseQuery;
    }

    private async fetchSuccessfulLearners(options: { programId: number; intakeId?: number }) {
        const { programId, intakeId } = options;
        const baseQuery = this.constructProgramBaseQuery({
            programId,
            intakeId,
            intakeStatus: IntakeCompletionStatus.PASSED,
        });
        const result = await baseQuery
            .clone()
            .innerJoin(
                'learner.userProgramCertificates',
                'userProgramCertificate',
                'userProgramCertificate.programId = :programId',
                {
                    programId,
                },
            )
            .select('COUNT(DISTINCT userProgramCertificate.userId)', 'successfulLearners')
            .getRawOne();

        return result && result.successfulLearners ? result.successfulLearners : 0;
    }

    async fetchNumberOfEnrollments(options: {
        programId: number;
        intakeId?: number;
        intakeStatus?: IntakeCompletionStatus;
    }) {
        const { programId, intakeId, intakeStatus } = options;
        if (intakeId) {
            const numberOfLearners = await this.fetchNumberOfEnrollmentsBasedOnSuccess({ programId, intakeId });
            return numberOfLearners.numberOfSuccessfulLearners + numberOfLearners.numberOfFailedLearners;
        }
        const baseQuery = this.constructProgramBaseQuery({ programId, intakeId, intakeStatus });
        const result = await baseQuery
            .clone()
            .select('COUNT(DISTINCT learner.id)', 'numberOfEnrolledStudents')
            .groupBy('program.id')
            .setParameter('programId', programId)
            .getRawOne();

        return result && result.numberOfEnrolledStudents ? Number(result.numberOfEnrolledStudents) : 0;
    }

    private constructCourseScorePercentageQuery(options: { courseId: number; baseQuery: any }) {
        const { baseQuery, courseId } = options;
        return baseQuery
            .clone()
            .innerJoin('program.tracks', 'track')
            .innerJoin('track.relTrackCourses', 'relTrackCourses')
            .innerJoin('relTrackCourses.course', 'course', 'relTrackCourses.courseId = :courseId', { courseId })
            .leftJoin(
                'course.userCompletedCourses',
                'userCompletedCourse',
                'userCompletedCourse.courseId = course.id AND userCompletedCourse.learnerId = learner.id',
            )
            .select('course.id', 'courseId')
            .addSelect(`SUM(userCompletedCourse.score) / COUNT(DISTINCT learner.id) AS scoreAvgPercentage`)
            .where('course.id = :courseId', { courseId })
            .groupBy('course.id');
    }

    public constructCourseCompletionPercentageQuery(options: { courseId: number; baseQuery: any }) {
        const { baseQuery, courseId } = options;
        const completionPercentagesSubquery = baseQuery.clone();

        completionPercentagesSubquery
            .innerJoin('program.tracks', 'track')
            .innerJoin('track.relTrackCourses', 'relTrackCourses')
            .innerJoin('relTrackCourses.course', 'course', 'relTrackCourses.courseId = :courseId', { courseId })
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

    private async fetchProgramCompletionStatistics(options: { programId: number; intakeId?: number }) {
        const { programId, intakeId } = options;
        const tracks = await this.trackRepository
            .createQueryBuilder('track')
            .innerJoinAndSelect('track.relTrackCourses', 'relTrackCourses')
            .innerJoinAndSelect('relTrackCourses.course', 'course')
            .where('track.programId = :programId', { programId })
            .getMany();

        const baseQuery = this.constructProgramBaseQuery({
            programId,
            intakeId,
            intakeStatus: IntakeCompletionStatus.PASSED,
        });

        let totalCourseCompletionPercentage = 0;
        let totalCourseScorePercentage = 0;
        let totalCourses = 0;

        for (const track of tracks) {
            for (const relTrackCourse of track.relTrackCourses) {
                const totalLessonsCount = await this.courseService.fetchTotalLessonsCount(relTrackCourse.course.id);
                const completionPercentagesSubquery = this.constructCourseCompletionPercentageQuery({
                    baseQuery,
                    courseId: relTrackCourse.course.id,
                });
                const scorePercentagesSubquery = this.constructCourseScorePercentageQuery({
                    baseQuery,
                    courseId: relTrackCourse.course.id,
                });
                const courseCompletionPercentage = await baseQuery
                    .clone()
                    .innerJoin('program.tracks', 'track')
                    .innerJoin('track.relTrackCourses', 'relTrackCourses')
                    .innerJoin(
                        'relTrackCourses.course',
                        'course',
                        'relTrackCourses.courseId = :courseId AND relTrackCourses.trackId = :trackId  ',
                        {
                            courseId: relTrackCourse.course.id,
                            trackId: track.id,
                        },
                    )
                    .select('course.id', 'courseId')
                    .addSelect(
                        `(SELECT AVG(sub.completionPercentage) FROM (${completionPercentagesSubquery.getQuery()}) AS sub)`,
                        'averageCourseCompletion',
                    )
                    .addSelect(
                        `(SELECT sub.scoreAvgPercentage FROM (${scorePercentagesSubquery.getQuery()}) AS sub)`,
                        'averageScorePercentage',
                    )
                    .setParameter('totalLessonsCount', totalLessonsCount)
                    .getRawOne();

                if (!courseCompletionPercentage) continue;

                totalCourseCompletionPercentage += Number(courseCompletionPercentage.averageCourseCompletion) || 0;
                totalCourseScorePercentage += Number(courseCompletionPercentage.averageScorePercentage) || 0;
                totalCourses++;
            }
        }

        const averageProgramCompletionPercentage =
            totalCourses > 0 ? totalCourseCompletionPercentage / totalCourses : 0;
        const averageProgramScorePercentage = totalCourses > 0 ? totalCourseScorePercentage / totalCourses : 0;

        return {
            completionPercentage: Math.round(averageProgramCompletionPercentage),
            scorePercentage: Math.round(averageProgramScorePercentage),
        };
    }

    async fetchProgramCompletionPercentageForFailedIntakes(programId: number, intakeId: number) {
        const programBaseQuery = this.constructProgramBaseQuery({
            programId,
            intakeId,
            intakeStatus: IntakeCompletionStatus.FAILED,
        });
        const result = await programBaseQuery
            .clone()
            .select('AVG(relIntakeLearnerHistory.progress)', 'programCompletionPercentage')
            .addSelect('AVG(relIntakeLearnerHistory.score)', 'programScorePercentage')
            .where('program.id = :programId', { programId })
            .getRawOne();
        return {
            completionPercentage: Math.round(result.programCompletionPercentage) || 0,
            scorePercentage: Math.round(result.programScorePercentage) || 0,
        };
    }

    async fetchNumberOfEnrollmentsBasedOnSuccess(options: { programId: number; intakeId?: number }) {
        const { programId, intakeId } = options;
        const successfulLearnersQuery = await this.constructProgramBaseQuery({
            programId,
            intakeId,
            intakeStatus: IntakeCompletionStatus.PASSED,
        });
        const failedLearnersQuery = await this.constructProgramBaseQuery({
            programId,
            intakeId,
            intakeStatus: IntakeCompletionStatus.FAILED,
        });

        const successfulLearners = await successfulLearnersQuery
            .select('COUNT(DISTINCT learner.id)', 'numberOfEnrolledStudents')
            .groupBy('program.id')
            .setParameter('programId', programId)
            .getRawOne();

        const failedLearners = await failedLearnersQuery
            .select('COUNT(DISTINCT learner.id)', 'numberOfEnrolledStudents')
            .groupBy('program.id')
            .setParameter('programId', programId)
            .getRawOne();

        return {
            numberOfSuccessfulLearners: Number(
                successfulLearners?.numberOfEnrolledStudents ? successfulLearners.numberOfEnrolledStudents : 0,
            ),
            numberOfFailedLearners: Number(
                failedLearners?.numberOfEnrolledStudents ? failedLearners.numberOfEnrolledStudents : 0,
            ),
        };
    }

    async getProgramAndIntakeStatistics(
        programId: number,
        intakeId?: number,
    ): Promise<{
        numberOfEnrolledStudents: number;
        successfulLearners: number;
        scoreAvgPercentage: number;
        averageCompletion: number;
    }> {
        try {
            const successfulLearnersQueryRes = await this.fetchSuccessfulLearners({ programId, intakeId });
            const successfulLearnersStatistics = await this.fetchProgramCompletionStatistics({ programId, intakeId });
            if (intakeId) {
                const numberOfEnrolledStudents = await this.fetchNumberOfEnrollmentsBasedOnSuccess({
                    programId,
                    intakeId,
                });
                const totalNumberOfEnrolledStudents =
                    numberOfEnrolledStudents.numberOfSuccessfulLearners +
                    numberOfEnrolledStudents.numberOfFailedLearners;
                const failedLearnersStatistics = await this.fetchProgramCompletionPercentageForFailedIntakes(
                    programId,
                    intakeId,
                );
                const scorePercentage =
                    (failedLearnersStatistics.scorePercentage * numberOfEnrolledStudents.numberOfFailedLearners +
                        successfulLearnersStatistics.scorePercentage *
                            numberOfEnrolledStudents.numberOfSuccessfulLearners) /
                    totalNumberOfEnrolledStudents;

                const progressPercentage =
                    (failedLearnersStatistics.completionPercentage * numberOfEnrolledStudents.numberOfFailedLearners +
                        successfulLearnersStatistics.completionPercentage *
                            numberOfEnrolledStudents.numberOfSuccessfulLearners) /
                    totalNumberOfEnrolledStudents;
                return {
                    numberOfEnrolledStudents: totalNumberOfEnrolledStudents,
                    successfulLearners: successfulLearnersQueryRes,
                    scoreAvgPercentage: scorePercentage,
                    averageCompletion: progressPercentage,
                };
            }
            const totalNumberOfEnrolledStudents = await this.fetchNumberOfEnrollments({ programId });

            return {
                numberOfEnrolledStudents: totalNumberOfEnrolledStudents,
                successfulLearners: successfulLearnersQueryRes,
                scoreAvgPercentage: successfulLearnersStatistics.scorePercentage,
                averageCompletion: successfulLearnersStatistics.completionPercentage,
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
