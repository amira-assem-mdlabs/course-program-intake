// import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
// import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
// import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
// import { ProgramService } from '../../program/services/program.service';
// import { LessonScheduleExtendService } from './lesson-schedule.extend.service';
// import { CourseService } from '../../course/services/course.service';
// import { CourseDTO } from '../../course/dto/course.dto';
// import { SectionDTO } from '../../course/dto/section.dto';
// import { ProgramDTO } from '../../program/dto/program.dto';
// import { TrackDTO } from '../../program/dto/track.dto';
// import { IntakeStudyPlan } from '../entities/intake-study-plan.entity';
// import { IntakeStudyPlanMapper } from '../mappers/intake-study-plan.mapper';
// import { IntakeStudyPlanRepository } from '../repositories/intake-study-plan.repository';
// import { IntakeStudyPlanDTO } from '../dto/intake-study-plan.dto';

// const relationshipNames = [];
// relationshipNames.push('intake');

// @Injectable()
// export class IntakeStudyPlanExtendService {
//     logger = new Logger('IntakeStudyPlanExtendService');
//     private intakeStudyPlanRepository: IntakeStudyPlanRepository;

//     constructor(
//         @Inject(CONNECTION) connection: Connection,
//         private readonly courseService: CourseService,
//         private readonly programService: ProgramService,
//         private readonly lessonScheduleService: LessonScheduleExtendService,
//     ) {
//         if (connection) {
//             this.intakeStudyPlanRepository = connection.getRepository(IntakeStudyPlan);
//         }
//     }

//     async findById(id: number): Promise<IntakeStudyPlanDTO | undefined> {
//         const options = { relations: relationshipNames };
//         const result = await this.intakeStudyPlanRepository.findOne(id, options);
//         return IntakeStudyPlanMapper.fromEntityToDTO(result);
//     }

//     async findByFields(options: FindOneOptions<IntakeStudyPlanDTO>): Promise<IntakeStudyPlanDTO | undefined> {
//         const result = await this.intakeStudyPlanRepository.findOne(options);
//         return IntakeStudyPlanMapper.fromEntityToDTO(result);
//     }

//     async findAndCount(options: FindManyOptions<IntakeStudyPlanDTO>): Promise<[IntakeStudyPlanDTO[], number]> {
//         options.relations = relationshipNames;
//         const resultList = await this.intakeStudyPlanRepository.findAndCount(options);
//         const intakeStudyPlanDTO: IntakeStudyPlanDTO[] = [];
//         if (resultList && resultList[0]) {
//             resultList[0].forEach(intakeStudyPlan =>
//                 intakeStudyPlanDTO.push(IntakeStudyPlanMapper.fromEntityToDTO(intakeStudyPlan)),
//             );
//             resultList[0] = intakeStudyPlanDTO;
//         }
//         return resultList;
//     }

//     async save(intakeStudyPlanDTO: IntakeStudyPlanDTO, creator?: string): Promise<IntakeStudyPlanDTO | undefined> {
//         const entity = IntakeStudyPlanMapper.fromDTOtoEntity(intakeStudyPlanDTO);
//         if (creator) {
//             if (!entity.createdBy) {
//                 entity.createdBy = creator;
//             }
//             entity.lastModifiedBy = creator;
//         }
//         const result = await this.intakeStudyPlanRepository.save(entity);
//         return IntakeStudyPlanMapper.fromEntityToDTO(result);
//     }

//     async update(intakeStudyPlanDTO: IntakeStudyPlanDTO, updater?: string): Promise<IntakeStudyPlanDTO | undefined> {
//         const entity = IntakeStudyPlanMapper.fromDTOtoEntity(intakeStudyPlanDTO);
//         if (updater) {
//             entity.lastModifiedBy = updater;
//         }
//         const result = await this.intakeStudyPlanRepository.save(entity);
//         return IntakeStudyPlanMapper.fromEntityToDTO(result);
//     }

//     async deleteById(id: number): Promise<void | undefined> {
//         await this.intakeStudyPlanRepository.delete(id);
//         const entityFind = await this.findById(id);
//         if (entityFind) {
//             throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
//         }
//         return;
//     }

//     async scheduleEntityLessons(
//         entities: SectionDTO[] | CourseDTO[] | TrackDTO[],
//         startDate: string,
//         daysPerLesson: number,
//         idField: 'courseId' | 'sectionId' | 'trackId',
//         studyPlan: IntakeStudyPlanDTO,
//     ) {
//         let lessonDate = new Date(startDate);
//         for (const entity of entities) {
//             const lessons = await this.lessonScheduleService.getLessonsBy({ [idField]: entity.id }, studyPlan.id);
//             for (const lesson of lessons) {
//                 await this.lessonScheduleService.update({
//                     ...lesson,
//                     startDate: lessonDate.toISOString().split('T')[0],
//                 });
//                 lessonDate.setDate(lessonDate.getDate() + daysPerLesson);
//             }
//         }
//     }

//     async checkAutoScheduleLessons(
//         entityType: 'Course' | 'Program',
//         entity: CourseDTO | ProgramDTO,
//         daysPerLesson: number,
//         daysAvailable: number,
//         intakeStudyPlanDTO: IntakeStudyPlanDTO,
//     ) {
//         let totalNumOfLessons: number;
//         if (entityType === 'Course') {
//             const courseStatistics = await this.courseService.fetchCourseStatsV2({
//                 slug: entity.slug,
//                 countLessons: true,
//             });
//             totalNumOfLessons = courseStatistics.numOfLessons;
//         } else if (entityType === 'Program') {
//             const programStatistics = await this.programService.fetchProgramStats(entity.id, {
//                 countCourses: true,
//                 countLessons: true,
//             });
//             totalNumOfLessons = programStatistics.numOfLessons;
//         }

//         const totalDaysNeeded = totalNumOfLessons * daysPerLesson;

//         if (totalDaysNeeded > daysAvailable) {
//             throw new HttpException('DAYS_LIMIT_EXCEEDED', HttpStatus.BAD_REQUEST);
//         }

//         await this[`schedule${entityType}Lessons`](entity.id, intakeStudyPlanDTO);
//     }

//     async scheduleCourseLessons(courseId: number, studyPlan: IntakeStudyPlanDTO) {
//         const { daysPerLesson, startDate } = studyPlan;
//         const course = await this.courseService.getCourseWithOrderedSections(courseId);
//         await this.scheduleEntityLessons(course.sections, startDate, daysPerLesson, 'sectionId', studyPlan);
//     }

//     async scheduleProgramLessons(programId: number, studyPlan: IntakeStudyPlanDTO) {
//         const { daysPerLesson, startDate } = studyPlan;
//         const program = await this.programService.getProgramCustomized(programId, {
//             includeTracks: true,
//         });
//         await this.scheduleEntityLessons(program.tracks, startDate, daysPerLesson, 'trackId', studyPlan);
//     }

//     async findIntakesStudyPlanByCourse(courseId: number): Promise<IntakeStudyPlanDTO[]> {
//         const directIntakes = await this.intakeStudyPlanRepository
//             .createQueryBuilder('intake_study_plan')
//             .leftJoinAndSelect('intake_study_plan.intake', 'intake')
//             .leftJoin('intake.relIntakeCourses', 'relIntakeCourses')
//             .where('relIntakeCourses.courseId = :courseId', { courseId })
//             .getMany();

//         const programIntakes = await this.intakeStudyPlanRepository
//             .createQueryBuilder('intake_study_plan')
//             .leftJoinAndSelect('intake_study_plan.intake', 'intake')
//             .leftJoin('intake.relIntakePrograms', 'relIntakePrograms')
//             .leftJoin('relIntakePrograms.program', 'program')
//             .leftJoin('program.tracks', 'track')
//             .leftJoin('track.relTrackCourses', 'relTrackCourse')
//             .where('relTrackCourse.courseId = :courseId', { courseId })
//             .getMany();

//         return [...directIntakes, ...programIntakes];
//     }

//     async findIntakeStudyPlanByTrack(trackId: number): Promise<IntakeStudyPlanDTO> {
//         const programIntakeStudyPlan = await this.intakeStudyPlanRepository
//             .createQueryBuilder('intake_study_plan')
//             .leftJoinAndSelect('intake_study_plan.intake', 'intake')
//             .leftJoin('intake.relIntakePrograms', 'relIntakePrograms')
//             .leftJoin('relIntakePrograms.program', 'program')
//             .leftJoin('program.tracks', 'track')
//             .where('track.id = :trackId', { trackId })
//             .getOne();

//         return programIntakeStudyPlan;
//     }
// }
