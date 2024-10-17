// import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
// import { LessonScheduleDTO } from './dto/lesson-schedule.dto';
// import { LessonScheduleMapper } from './mapper/lesson-schedule.mapper';
// import { LessonScheduleRepository } from '../repository/lesson-schedule.repository';
// import { LessonSchedule } from '../domain/lesson-schedule.entity';
// import { CONNECTION } from '../utilities/multi-tenancy/tenancy.symbols';

// const relationshipNames = [];
// relationshipNames.push('lesson');
// relationshipNames.push('intakeStudyPlan');

// @Injectable()
// export class LessonScheduleExtendService {
//     logger = new Logger('LessonScheduleExtendService');
//     private lessonScheduleRepository: LessonScheduleRepository;

//     constructor(@Inject(CONNECTION) connection: Connection) {
//         if (connection) {
//             this.lessonScheduleRepository = connection.getRepository(LessonSchedule);
//         }
//     }

//     async findById(id: number): Promise<LessonScheduleDTO | undefined> {
//         const options = { relations: relationshipNames };
//         const result = await this.lessonScheduleRepository.findOne(id, options);
//         return LessonScheduleMapper.fromEntityToDTO(result);
//     }

//     async findByFields(options: FindOneOptions<LessonScheduleDTO>): Promise<LessonScheduleDTO | undefined> {
//         const result = await this.lessonScheduleRepository.findOne(options);
//         return LessonScheduleMapper.fromEntityToDTO(result);
//     }

//     async findAndCount(options: FindManyOptions<LessonScheduleDTO>): Promise<[LessonScheduleDTO[], number]> {
//         options.relations = relationshipNames;
//         const resultList = await this.lessonScheduleRepository.findAndCount(options);
//         const lessonScheduleDTO: LessonScheduleDTO[] = [];
//         if (resultList && resultList[0]) {
//             resultList[0].forEach(lessonSchedule =>
//                 lessonScheduleDTO.push(LessonScheduleMapper.fromEntityToDTO(lessonSchedule)),
//             );
//             resultList[0] = lessonScheduleDTO;
//         }
//         return resultList;
//     }

//     async save(lessonScheduleDTO: LessonScheduleDTO, creator?: string): Promise<LessonScheduleDTO | undefined> {
//         const entity = LessonScheduleMapper.fromDTOtoEntity(lessonScheduleDTO);
//         if (creator) {
//             if (!entity.createdBy) {
//                 entity.createdBy = creator;
//             }
//             entity.lastModifiedBy = creator;
//         }
//         const result = await this.lessonScheduleRepository.save(entity);
//         return LessonScheduleMapper.fromEntityToDTO(result);
//     }

//     async update(lessonScheduleDTO: LessonScheduleDTO, updater?: string): Promise<LessonScheduleDTO | undefined> {
//         const entity = LessonScheduleMapper.fromDTOtoEntity(lessonScheduleDTO);
//         if (updater) {
//             entity.lastModifiedBy = updater;
//         }
//         const result = await this.lessonScheduleRepository.save(entity);
//         return LessonScheduleMapper.fromEntityToDTO(result);
//     }

//     async deleteById(id: number): Promise<void | undefined> {
//         await this.lessonScheduleRepository.delete(id);
//         const entityFind = await this.findById(id);
//         if (entityFind) {
//             throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
//         }
//         return;
//     }

//     async getLessonsBy(
//         filter: { sectionId?: number; courseId?: number; trackId?: number },
//         studyPlanId: number,
//     ): Promise<LessonScheduleDTO[]> {
//         try {
//             const queryBuilder = this.lessonScheduleRepository
//                 .createQueryBuilder('lesson_schedule')
//                 .innerJoinAndSelect('lesson_schedule.lesson', 'lesson')
//                 .innerJoin('lesson.section', 'section')
//                 .innerJoin('lesson_schedule.intakeStudyPlan', 'intakeStudyPlan')
//                 .where('intakeStudyPlan.id = :studyPlanId', { studyPlanId });

//             if (filter.sectionId) {
//                 queryBuilder.andWhere('section.id = :sectionId', { sectionId: filter.sectionId });
//             } else if (filter.courseId) {
//                 queryBuilder
//                     .leftJoin('section.course', 'course')
//                     .andWhere('course.id = :courseId', { courseId: filter.courseId })
//                     .orderBy('section.order', 'ASC');
//             } else if (filter.trackId) {
//                 queryBuilder
//                     .leftJoin('section.course', 'course')
//                     .leftJoin('course.relTrackCourses', 'relTrackCourses')
//                     .leftJoin('relTrackCourses.track', 'track')
//                     .andWhere('track.id = :trackId', { trackId: filter.trackId })
//                     .orderBy('relTrackCourses.order', 'ASC')
//                     .addOrderBy('section.order', 'ASC');
//             }

//             const lessons = await queryBuilder.addOrderBy('lesson.order', 'ASC').getMany();
//             return lessons;
//         } catch (error) {
//             console.log('error', error);

//             throw new HttpException('Error, studyPlanId not found', HttpStatus.BAD_REQUEST);
//         }
//     }
// }
