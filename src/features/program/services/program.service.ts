import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Inject, Injectable, HttpException, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions, In } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ProgramDTO } from '../dto/program.dto';
import { ProgramExtendDTO } from '../dto/program.extend.dto';
import { TrackDTO } from '../dto/track.dto';
import { PageRequest } from '../../../common/entities/pagination.entity';

import { CourseService } from '../../course/services/course.service';
import { ProgramMapper } from '../mappers/program.mapper';
import { UserCompletedCourseService } from '../../course/services/user-completed-course.service';
import { RelIntakeProgramService } from '../../intake/services/rel-intake-program.extend.service';
import { Program } from '../entities/program.entity';
import { RelLearnerProgram } from '../entities/rel-learner-program.entity';
import { ProgramRepository } from '../repositories/program.repository';
import { RelLearnerProgramRepository } from '../repositories/rel-learner-program.repository';
import { TrackService } from './track.extend.service';

const relationshipNames = [];
relationshipNames.push('category');

@Injectable()
export class ProgramService {
    logger = new Logger('ProgramService');
    private programRepository: ProgramRepository;
    private relLearnerProgramRepository: RelLearnerProgramRepository;

    constructor(
        @Inject(CONNECTION) connection: Connection,
        private readonly trackService: TrackService,
        private readonly courseService: CourseService,
        private readonly userCompletedCourseService: UserCompletedCourseService,
        private readonly relIntakeProgramService: RelIntakeProgramService,
    ) {
        if (connection) {
            this.programRepository = connection.getRepository(Program);
            this.relLearnerProgramRepository = connection.getRepository(RelLearnerProgram);
        }
    }

    async findById(id: number, findOneOptions?: FindOneOptions<Program>): Promise<ProgramDTO | undefined> {
        const options = { ...findOneOptions };

        if (options.relations) {
            options.relations = [...options.relations, 'category'];
        } else {
            options.relations = relationshipNames;
        }

        const result = await this.programRepository.findOne(id, options);
        return ProgramMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<Program>): Promise<ProgramDTO | undefined> {
        const result = await this.programRepository.findOne(options);
        return ProgramMapper.fromEntityToDTO(result);
    }

    async getProgramDynamicFieldsData(program: ProgramDTO): Promise<ProgramExtendDTO> {
        const result = await this.programRepository
            .createQueryBuilder('program')
            .leftJoin('program.tracks', 'tracks')
            .leftJoin('tracks.relTrackCourses', 'relTrackCourses')
            .leftJoin('relTrackCourses.course', 'course')
            .select('COUNT(DISTINCT course.id)', 'coursesCount')
            .groupBy('program.id')
            .having('program.id = :id', { id: program.id })
            .getRawOne();

        return {
            ...program,
            tracksCount: program.tracks?.length ?? 0,
            coursesCount: result && result.coursesCount ? Number(result.coursesCount) : 0,
        };
    }

    async findOne(queryParams: {
        id?: number;
        slug?: string;
        learnerId?: number;
        shouldCalculateProgress: boolean;
    }): Promise<ProgramDTO | undefined> {
        const { id, slug } = queryParams;
        let query = this.programRepository
            .createQueryBuilder('program')
            .leftJoinAndSelect('program.tracks', 'tracks')
            .leftJoinAndSelect('tracks.relTrackCourses', 'relTrackCourses')
            .leftJoinAndSelect('relTrackCourses.course', 'course');

        if (id) {
            query = query.where('program.id = :id', { id });
        } else if (slug) {
            query = query.where('program.slug = :slug', { slug });
        }

        const program = await query.orderBy('tracks.order', 'ASC').addOrderBy('relTrackCourses.order', 'ASC').getOne();

        return program;
    }

    async findLearnerPrograms(learnerId: number): Promise<ProgramDTO[] | undefined> {
        const query = this.programRepository
            .createQueryBuilder('program')
            .leftJoinAndSelect('program.tracks', 'tracks')
            .leftJoinAndSelect('tracks.relTrackCourses', 'relTrackCourses')
            .leftJoinAndSelect('relTrackCourses.course', 'course')
            .leftJoin('program.relLearnerPrograms', 'relLearnerPrograms')
            .leftJoin('relLearnerPrograms.learner', 'learner')
            .where('learner.id = :id', { id: learnerId });

        const result = await query.getMany();

        return result;
    }

    // async getLearnerProgramsReport(
    //     pageRequest: PageRequest,
    //     studentId: string,
    // ): Promise<[ProgramSummaryDTO[], number]> {
    //     let query = this.relLearnerProgramRepository
    //         .createQueryBuilder('relLearnerProgram')
    //         .innerJoin(
    //             'relLearnerProgram.learner',
    //             'learner',
    //             'relLearnerProgram.learnerId = learner.id AND learner.id = :studentId',
    //             { studentId },
    //         )
    //         .leftJoin(
    //             'learner.relIntakeLearners',
    //             'rel_learner_intake',
    //             'rel_learner_intake.learnerId = learner.id AND rel_learner_intake.learnerId = :studentId',
    //             { studentId },
    //         )

    //         .innerJoin('relLearnerProgram.program', 'program', 'relLearnerProgram.programId = program.id')
    //         .leftJoin(
    //             'program.relIntakePrograms',
    //             'rel_program_intake',
    //             'rel_program_intake.programId = program.id AND rel_program_intake.intakeId = rel_learner_intake.intakeId',
    //         )

    //         .leftJoin(
    //             'program.userProgramCertificates',
    //             'program_certificates',
    //             'program.id =program_certificates.programId AND program_certificates.userId = :studentId',
    //             { studentId },
    //         )

    //         .leftJoin('program.tracks', 'track')
    //         .leftJoin('track.relTrackCourses', 'relTrackCourse')
    //         .leftJoin('relTrackCourse.course', 'course')
    //         .leftJoin(
    //             'learner.userCompletedCourses',
    //             'completed_courses',
    //             'completed_courses.learnerId = learner.id AND completed_courses.courseId =course.id',
    //         )
    //         .leftJoin(
    //             subquery => {
    //                 return subquery
    //                     .from('user_completed_course', 'completed_courses')
    //                     .innerJoin('course', 'course', 'course.id = completed_courses.courseId')
    //                     .where('completed_courses.learnerId = :studentId', { studentId })
    //                     .select('MAX(completed_courses.score)', 'final_score')
    //                     .addSelect('completed_courses.courseId', 'course_id')
    //                     .groupBy('completed_courses.courseId');
    //             },
    //             'unique_scores',
    //             'course.id = unique_scores.course_id',
    //         )
    //         .select('program.nameAr ', 'name')
    //         .addSelect('program_certificates.createdDate ', 'endDate')
    //         .addSelect('relLearnerProgram.createdDate ', 'startDate')
    //         .addSelect('MAX(rel_program_intake.id) ', 'intakeId')
    //         .addSelect('program_certificates.id ', 'certificateId')
    //         .addSelect('program.id', 'programId')
    //         .addSelect(
    //             `COALESCE((SUM( DISTINCT unique_scores.final_score)::FLOAT / NULLIF(COUNT(DISTINCT course.id), 0)::FLOAT)::DECIMAL(10,2),0)::FLOAT`,
    //             'score',
    //         )
    //         .addSelect(
    //             `COALESCE(((COUNT(DISTINCT completed_courses.id)::FLOAT / NULLIF(COUNT(DISTINCT course.id), 0)::FLOAT) * 100.0) ::DECIMAL(10,2),0)::FLOAT`,
    //             'progressPercentage',
    //         )
    //         .addSelect('program.slug', 'slug')
    //         .groupBy('program.nameAr')
    //         .addGroupBy('relLearnerProgram.createdDate')
    //         .addGroupBy('program_certificates.createdDate')
    //         .addGroupBy('program.id')
    //         .addGroupBy('program_certificates.id')
    //         .addGroupBy('program.slug')
    //         .orderBy('program.id')
    //         .offset(Number(pageRequest.page * pageRequest.size))
    //         .limit(Number(pageRequest.size));

    //     const result = (await query.getRawMany()) as ProgramSummaryDTO[];

    //     const { count } = await this.relLearnerProgramRepository
    //         .createQueryBuilder('relLearnerProgram')
    //         .select('CAST(COUNT(*) AS INTEGER)')
    //         .where('relLearnerProgram.learnerId = :studentId', { studentId })
    //         .getRawOne();

    //     return [result, count || 0];
    // }

    async findAndCount(options: FindManyOptions<Program>): Promise<[ProgramDTO[], number]> {
        if (options.relations) {
            options.relations = [...options.relations, 'category'];
        } else {
            options.relations = relationshipNames;
        }
        const [results, count] = await this.programRepository.findAndCount(options);
        const programDTO: ProgramDTO[] = results.map(program => ProgramMapper.fromEntityToDTO(program));

        return [programDTO, count];
    }

    async findAndCountV2(pageRequest: PageRequest): Promise<[ProgramDTO[], number]> {
        const query = this.programRepository
            .createQueryBuilder('program')
            .leftJoinAndSelect('program.tracks', 'tracks')
            .leftJoinAndSelect('tracks.relTrackCourses', 'relTrackCourses')
            .leftJoinAndSelect('relTrackCourses.course', 'course')
            .orderBy('tracks.order', 'ASC')
            .addOrderBy('relTrackCourses.order', 'ASC');

        const count = await query.getCount();

        const results = await query
            .skip(+pageRequest.page * +pageRequest.size)
            .take(+pageRequest.size)
            .getMany();

        return [results, count];
    }

    async save(programDTO: ProgramDTO, creator?: string): Promise<ProgramDTO | undefined> {
        programDTO = this.predefineNeededParamsInProgramDTO(programDTO);
        const entity = ProgramMapper.fromDTOtoEntity(programDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.programRepository.save(entity);

        const defaultTrack: TrackDTO = {
            nameEn: 'Default Track',
            nameAr: 'المسار التعليمي الافتراضي',
            descriptionEn: null,
            descriptionAr: null,
            slug: uuid(),
            order: null,
            courseInOrder: false,
            relTrackCourses: [],
            program: result,
            // userTrackCertificates: [],
            userCompletedTracks: [],
            relIntakeTracks: [],
        };

        await this.trackService.save(defaultTrack);

        return ProgramMapper.fromEntityToDTO(result);
    }

    predefineNeededParamsInProgramDTO(programDTO: ProgramDTO): ProgramDTO {
        if (!programDTO.trackCertificate) programDTO.trackCertificate = false;
        if (!programDTO.courseCertificate) programDTO.courseCertificate = false;
        if (!programDTO.trackInOrder) programDTO.trackInOrder = false;
        if (!programDTO.featured) programDTO.featured = false;
        return programDTO;
    }

    async update(programDTO: ProgramDTO, updater?: string): Promise<ProgramDTO | undefined> {
        if (!programDTO.id) throw new BadRequestException(`Program ID isn't found`);
        programDTO = this.predefineNeededParamsInProgramDTO(programDTO);
        const previousProgram = await this.programRepository.findOne(programDTO.id);
        if (!previousProgram) throw new BadRequestException('Program not found');
        console.log(previousProgram);
        console.log(programDTO);
        if (previousProgram.status !== programDTO.status && programDTO.status !== undefined) {
            programDTO.publishedBy = updater;
            programDTO.publishDate = new Date();
        }
        const entity = ProgramMapper.fromDTOtoEntity(programDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.programRepository.save(entity);
        return ProgramMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.programRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async getProgramsTracks(programIds: number[]): Promise<TrackDTO[]> {
        let programs = await this.programRepository.find({
            where: {
                id: In(programIds),
            },
            relations: ['tracks', 'tracks.relTrackCourses', 'tracks.relTrackCourses.course'],
        });

        const programDTO: ProgramDTO[] = [];
        if (programs) {
            programs.forEach(program => programDTO.push(ProgramMapper.fromEntityToDTO(program)));
            programs = programDTO;
        }

        const tracks = [];
        programs.map(program => tracks.push(program.tracks));

        return tracks;
    }

    // async addProgramTracksCoursesProgress(program: ProgramExtendDTO, learnerId: number) {
    //     let allDoneCourses = 0;
    //     let totalCourses = 0;
    //     for (let i = 0; i < program.tracks.length; i++) {
    //         let trackDoneCourses = 0;
    //         const track = program.tracks[i];
    //         totalCourses += track.relTrackCourses.length;
    //         for (const relTrackCourse of track.relTrackCourses) {
    //             if (relTrackCourse.course) {
    //                 const course = relTrackCourse.course;
    //                 const courseStatistics = await this.courseService.fetchCourseStatsV2({
    //                     slug: course.slug,
    //                     countLessons: true,
    //                 });
    //                 const learnerCourseProgress = await this.courseService.getLearnerCourseProgressV2(
    //                     learnerId,
    //                     relTrackCourse.course.id,
    //                     courseStatistics.numOfLessons,
    //                 );
    //                 if (learnerCourseProgress && learnerCourseProgress === 100) {
    //                     trackDoneCourses += 1;
    //                     allDoneCourses += 1;
    //                 }
    //                 relTrackCourse.course = {
    //                     ...course,
    //                     ...courseStatistics,
    //                     progress: learnerCourseProgress || 0,
    //                 };
    //             }
    //         }
    //         track.progress = Math.round((trackDoneCourses / track.relTrackCourses.length) * 100);
    //     }
    //     program.progress = Math.round((allDoneCourses / totalCourses) * 100);
    // }

    private getCourseGrade(score: number, locale: string | undefined) {
        if (score >= 90 && score <= 100) {
            return locale === 'en' ? 'Excellent' : 'ممتاز';
        } else if (score >= 75 && score <= 89) {
            return locale === 'en' ? 'Very Good' : 'جيد جداً';
        } else if (score >= 65 && score <= 74) {
            return locale === 'en' ? 'Good' : 'جيد';
        } else if (score >= 50 && score <= 64) {
            return locale === 'en' ? 'Pass' : 'مقبول';
        } else if (score >= 0 && score <= 49) {
            return locale === 'en' ? 'Fail' : 'ضعيف';
        }
    }

    // async generateTranscriptData(program: ProgramExtendDTO, learnerId: number, locale: string | undefined) {
    //     const relIntakeProgram = await this.relIntakeProgramService.findByFields({
    //         where: { program: { id: program.id } },
    //         relations: ['intake'],
    //     });
    //     const data: ProgramTranscriptDTO = {
    //         id: program.id,
    //         name: locale === 'en' ? program.nameEn : program.nameAr,
    //         intakeName: relIntakeProgram?.intake?.name,
    //         tracks: [],
    //         averageScore: 0,
    //     };

    //     for (let i = 0; i < program.tracks.length; i++) {
    //         const track = program.tracks[i];

    //         data.tracks[i] = {
    //             id: track.id,
    //             name: locale === 'en' ? track.nameEn : track.nameAr,
    //             courses: [],
    //             averageScore: 0,
    //         };

    //         for (const relTrackCourse of track.relTrackCourses) {
    //             const course = relTrackCourse.course;

    //             const userCompletedCourse = await this.userCompletedCourseService.findByFields({
    //                 where: { course: { id: course.id }, learner: { id: learnerId } },
    //             });

    //             data.tracks[i].courses.push({
    //                 id: course.id,
    //                 name: course.name,
    //                 score:
    //                     userCompletedCourse &&
    //                     !isEmptyObject(userCompletedCourse) &&
    //                     Number.isInteger(userCompletedCourse.score)
    //                         ? userCompletedCourse.score
    //                         : null,
    //                 grade:
    //                     userCompletedCourse &&
    //                     !isEmptyObject(userCompletedCourse) &&
    //                     Number.isInteger(userCompletedCourse.score)
    //                         ? this.getCourseGrade(userCompletedCourse.score, locale)
    //                         : '---',
    //             });
    //         }

    //         const gradedCourses = data.tracks[i].courses.filter(course => course.score !== null);
    //         const coursesTotalScore = gradedCourses.reduce((sum, course) => sum + course.score, 0);
    //         const coursesCount = gradedCourses.length;

    //         data.tracks[i].averageScore =
    //             Number.isInteger(coursesCount) && coursesCount > 0
    //                 ? Math.round(coursesTotalScore / coursesCount)
    //                 : null;
    //     }

    //     const gradedTracks = data.tracks.filter(track => track.averageScore !== null);
    //     const tracksTotalAverageScore = gradedTracks.reduce((sum, track) => sum + track.averageScore, 0);
    //     const tracksCount = gradedTracks.length;

    //     data.averageScore =
    //         Number.isInteger(tracksCount) && tracksCount > 0 ? Math.round(tracksTotalAverageScore / tracksCount) : null;

    //     return data;
    // }

    // async getStudentAchievementsPrograms(
    //     pageRequest: PageRequest,
    //     programId: string,
    // ): Promise<[StudentsAchievementsReportDTO[], number, { email: string; name: string }[]]> {
    //     const learners = this.relLearnerProgramRepository
    //         .createQueryBuilder('relLearnerProgram')
    //         .select('learner.login', 'learner_email')
    //         .addSelect('learner.firstName', 'learner_name')
    //         .addSelect('learner.id', 'learner_id')
    //         .innerJoin('relLearnerProgram.learner', 'learner')
    //         .groupBy('learner.id')
    //         .orderBy('learner.id', 'ASC')
    //         .offset(Number(pageRequest.page * pageRequest.size))
    //         .limit(Number(pageRequest.size));

    //     if (programId && programId !== '' && programId !== 'undefined') {
    //         learners.where('relLearnerProgram.programId = :programId', { programId: programId });
    //         // .andWhere('relLearnerProgram.learnerId = :learnerId', { learnerId: 48 });
    //     }

    //     const learnersResult = await learners.getRawMany();

    //     let learnersCountQuery = this.relLearnerProgramRepository
    //         .createQueryBuilder('relLearnerProgram')
    //         .select('COUNT(DISTINCT(relLearnerProgram.learnerId))');
    //     if (programId && programId !== '' && programId !== 'undefined') {
    //         learnersCountQuery.where('relLearnerProgram.programId = :programId', { programId: programId });
    //     }

    //     const { count } = await learnersCountQuery.getRawOne();

    //     const learanersIds: number[] = learnersResult.map(({ learner_id }) => learner_id);
    //     const learanersData: { email: string; name: string }[] = [];

    //     learnersResult.map(item => {
    //         learanersData.push({
    //             email: item.learner_email,
    //             name: item.learner_name,
    //         });
    //     });

    //     const query = this.programRepository
    //         .createQueryBuilder('program')
    //         .select('program.name_ar  AS program_name')
    //         .addSelect('course."name"', 'course_name')
    //         .addSelect('course."slug"', 'course_slug')
    //         .addSelect('learner.login', 'learner_email')
    //         .addSelect('learner."firstName"', 'learner_name')
    //         .addSelect('userCompletedCourses.score', 'final_score')
    //         .addSelect('userCompletedCourses.createdDate', 'complete_date')
    //         .addSelect(
    //             'COUNT(DISTINCT(rel_lesson_learner."learnerId" , rel_lesson_learner."lessonId") )',
    //             'learner_completed_lessons',
    //         )
    //         .addSelect('total_lessons.total_lessons_count', 'course_total_lessons')
    //         .innerJoin('program.tracks', 'tracks')
    //         .innerJoin('tracks.relTrackCourses', 'relTrackCourses')
    //         .innerJoin('relTrackCourses.course', 'course')
    //         .leftJoin('course.sections', 'section')
    //         .leftJoin('section.lessons', 'lesson')
    //         .leftJoin('lesson.relLessonLearners', 'rel_lesson_learner')
    //         .innerJoin('rel_lesson_learner.learner', 'learner')
    //         .leftJoin(
    //             'course.userCompletedCourses',
    //             'userCompletedCourses',
    //             '"userCompletedCourses"."learnerId" = "learner"."id"',
    //         );

    //     query.leftJoin(
    //         subQuery => {
    //             return subQuery
    //                 .select('course.id', 'course_id')
    //                 .addSelect('COUNT(DISTINCT lesson.id)', 'total_lessons_count')
    //                 .from('course', 'course')
    //                 .leftJoin('course.sections', 'section')
    //                 .leftJoin('section.lessons', 'lesson')
    //                 .groupBy('course.id');
    //         },
    //         'total_lessons',
    //         '"total_lessons"."course_id" = "course"."id"',
    //     );

    //     if (programId && programId !== '' && programId !== 'undefined') {
    //         query
    //             .where('program.id = :programId', { programId: programId })
    //             .andWhere('learner.id IN (:...learnersIds)', { learnersIds: learanersIds });
    //     }

    //     query
    //         .groupBy('program.name_ar')
    //         .addGroupBy('course.name')
    //         .addGroupBy('course.slug')
    //         .addGroupBy('learner.login')
    //         .addGroupBy('learner.firstName')
    //         .addGroupBy('total_lessons.total_lessons_count')
    //         .addGroupBy('userCompletedCourses.score')
    //         .addGroupBy('userCompletedCourses.createdDate');

    //     // const sql = query.getSql();
    //     // const explainSql = `EXPLAIN ANALYZE ${sql}`;

    //     // const explainResult = await this.programRepository.query(explainSql);
    //     // console.log(explainResult);

    //     const result = await query.getRawMany();

    //     return [result, count || 0, learanersData];
    // }

    // async getProgramCourses(slug: string, studentId: number = null): Promise<ProgramCoursesReportDTO[]> {
    //     slug = slug.toLowerCase();
    //     const query = this.relLearnerProgramRepository
    //         .createQueryBuilder('relLearnerProgram')
    //         .innerJoin(
    //             'relLearnerProgram.learner',
    //             'learner',
    //             'relLearnerProgram.learnerId = learner.id AND learner.id = :studentId',
    //             { studentId },
    //         )
    //         .innerJoin(
    //             'relLearnerProgram.program',
    //             'program',
    //             'relLearnerProgram.programId = program.id AND program.slug = :slug',
    //             { slug },
    //         )
    //         .leftJoin('program.tracks', 'track')
    //         .leftJoin('track.relTrackCourses', 'relTrackCourse')
    //         .leftJoin('relTrackCourse.course', 'course')
    //         .select('course.id', 'id')
    //         .addSelect('course.slug', 'slug')
    //         .addSelect('course.name', 'name')
    //         .addSelect('course.status', 'status')
    //         .addSelect('course.isPublic', 'isPublic')
    //         .addSelect('course.allowCourseReview', 'allowCourseReview')
    //         .addSelect('course.showLecturer', 'showLecturer')
    //         .addSelect('course.showEnrollments', 'showEnrollments')
    //         .addSelect('course.publishDate', 'publishDate')
    //         .addSelect('course.lessonOrder', 'lessonOrder')
    //         .addSelect('course.price', 'price')
    //         .addSelect('course.description', 'description')
    //         .addSelect('relTrackCourse.order', 'order')
    //         .orderBy('track.order')
    //         .addOrderBy('relTrackCourse.order');
    //     return await query.getRawMany();
    // }

    async getStudentSpecificCourseDetails(slug: string, studentId: number = null) {
        slug = slug.toLowerCase();
        const query = this.relLearnerProgramRepository
            .createQueryBuilder('relLearnerProgram')
            .innerJoin(
                'relLearnerProgram.learner',
                'learner',
                'relLearnerProgram.learnerId = learner.id AND learner.id = :studentId',
                { studentId },
            )
            .innerJoin(
                'relLearnerProgram.program',
                'program',
                'relLearnerProgram.programId = program.id AND program.slug = :slug',
                { slug },
            )
            .leftJoin(
                'learner.relIntakeLearners',
                'rel_learner_intake',
                'rel_learner_intake.learnerId = learner.id AND rel_learner_intake.learnerId = :studentId',
                { studentId },
            )
            .leftJoin(
                'program.relIntakePrograms',
                'rel_program_intake',
                'rel_program_intake.programId = program.id AND rel_program_intake.intakeId = rel_learner_intake.intakeId',
            )
            .leftJoin(
                'program.userProgramCertificates',
                'program_certificates',
                'program.id =program_certificates.programId AND program_certificates.userId = :studentId',
                { studentId },
            )
            .leftJoin('program.tracks', 'track')
            .leftJoin('track.relTrackCourses', 'relTrackCourse')
            .leftJoin('relTrackCourse.course', 'course')
            .leftJoin(
                'learner.userCompletedCourses',
                'completed_courses',
                'completed_courses.learnerId = learner.id AND completed_courses.courseId =course.id',
            )
            .leftJoin(
                subquery => {
                    return subquery
                        .from('program', 'sub_query_program')
                        .leftJoin('sub_query_program.tracks', 'track')
                        .leftJoin('track.relTrackCourses', 'relTrackCourse')
                        .leftJoin('relTrackCourse.course', 'course')
                        .leftJoin(
                            'user_completed_course',
                            'user_completed_course',
                            'course.id = user_completed_course.courseId',
                        )
                        .where(
                            'user_completed_course.learnerId = :studentId AND user_completed_course.score is not null',
                            { studentId: studentId },
                        )
                        .select(
                            'COALESCE((SUM(user_completed_course.score)::FLOAT / NULLIF(COUNT(DISTINCT user_completed_course.courseId), 0)::FLOAT)::DECIMAL(10,2),0)::FLOAT',
                            'final_score',
                        )
                        .addSelect('sub_query_program.id', 'sub_query_program_id')
                        .groupBy('sub_query_program.id');
                },
                'unique_scores',
                'program.id = unique_scores.sub_query_program_id',
            )
            .select('program_certificates.createdDate ', 'endDate')
            .addSelect('relLearnerProgram.createdDate ', 'startDate')
            .addSelect(`unique_scores.final_score`, 'score')
            .addSelect(
                `COALESCE(((COUNT(DISTINCT completed_courses.id)::FLOAT / NULLIF(COUNT(DISTINCT course.id), 0)::FLOAT) * 100.0) ::DECIMAL(10,2),0)::FLOAT`,
                'progressPercentage',
            )
            .addSelect('MAX(rel_program_intake.id) ', 'intakeId')
            .addGroupBy('relLearnerProgram.createdDate')
            .addGroupBy('program_certificates.createdDate')
            .addGroupBy('unique_scores.final_score');
        return await query.getRawOne();
    }

    async getProgramCustomized(
        programId: number,
        { includeTracks = false, includeRelTrackCourses = false, includeCourses = false } = {},
    ): Promise<ProgramDTO | undefined> {
        const query = this.programRepository
            .createQueryBuilder('program')
            .where('program.id = :programId', { programId });

        if (includeTracks) {
            query.leftJoinAndSelect('program.tracks', 'tracks').orderBy('tracks.order', 'ASC');

            if (includeRelTrackCourses) {
                query
                    .leftJoinAndSelect('tracks.relTrackCourses', 'relTrackCourses')
                    .addOrderBy('relTrackCourses.order', 'ASC');

                if (includeCourses) {
                    query.leftJoinAndSelect('relTrackCourses.course', 'course');
                }
            }
        }

        return await query.getOne();
    }

    async fetchProgramStats(
        id: number,
        options: {
            countLessons: boolean;
            countCourses: boolean;
        },
    ): Promise<{
        numOfLessons: number;
        numOfCourses: number;
    }> {
        try {
            let query = this.programRepository.createQueryBuilder('program').where('program.id = :id', { id });

            if (options.countCourses || options.countLessons) {
                query
                    .leftJoin('program.tracks', 'tracks')
                    .leftJoin('tracks.relTrackCourses', 'relTrackCourses')
                    .leftJoin('relTrackCourses.course', 'course');

                if (options.countCourses) {
                    query.addSelect('COUNT(DISTINCT relTrackCourses.id) AS courses');
                }
            }

            if (options.countLessons) {
                query
                    .leftJoin('course.sections', 'section')
                    .leftJoin('section.lessons', 'lesson')
                    .addSelect('COUNT(DISTINCT lesson.id) AS lessons');
            }

            const result = await query.groupBy('program.id').getRawOne();

            return {
                numOfCourses: result ? Number(result.courses || 0) : 0,
                numOfLessons: result ? Number(result.lessons || 0) : 0,
            };
        } catch (error) {
            console.error(error);
            throw new HttpException('Error fetching program statistics.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
