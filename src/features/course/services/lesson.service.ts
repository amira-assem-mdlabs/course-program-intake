import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { ActivityType } from '../../../common/enumeration/activity-type';
import { Lesson } from '../entities/lesson.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { LessonMapper } from '../mappers/lesson.mapper';
import { LessonDTO } from '../dto/lesson.dto';

const relationshipNames = [];
relationshipNames.push('section');

@Injectable()
export class LessonService {
    logger = new Logger('LessonService');
    private lessonRepository: LessonRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.lessonRepository = connection.getRepository(Lesson);
        }
    }

    async findById(id: number): Promise<LessonDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.lessonRepository.findOne(id, options);
        return LessonMapper.fromEntityToDTO(result);
    }

    async findBySectionId(sectionId: number): Promise<any> {
        let result = await this.lessonRepository
            .createQueryBuilder('lesson')
            .leftJoinAndSelect('lesson.section', 'section')
            .where('section.id = :id', { id: sectionId })
            .orderBy('lesson.order', 'ASC')
            .getMany();
        return result;
    }

    async findByFields(options: FindOneOptions<LessonDTO>): Promise<LessonDTO | undefined> {
        const result = await this.lessonRepository.findOne(options);
        return LessonMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<LessonDTO>): Promise<[LessonDTO[], number]> {
        options.relations = relationshipNames;
        const [lessons, count] = await this.lessonRepository.findAndCount(options);
        const lessonDTOs: LessonDTO[] = lessons.map(lesson => LessonMapper.fromEntityToDTO(lesson));
        return [lessonDTOs, count];
    }

    async save(lessonDTO: LessonDTO, creator?: string): Promise<LessonDTO | undefined> {
        const [, num] = await this.findAndCount({ where: { section: lessonDTO.section.id } });
        const entity = LessonMapper.fromDTOtoEntity(lessonDTO);
        entity.order = num + 1;
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.lessonRepository.save(entity);
        return LessonMapper.fromEntityToDTO(result);
    }

    async update(lessonDTO: any, updater?: string): Promise<LessonDTO | undefined> {
        const entity = LessonMapper.fromDTOtoEntity(lessonDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.lessonRepository.save(entity);
        return LessonMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.lessonRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async findActivityLesson(activityId: number, type: ActivityType) {
        try {
            let query = this.lessonRepository
                .createQueryBuilder('lesson')
                .leftJoinAndSelect('lesson.section', 'section')
                .leftJoinAndSelect('section.course', 'course')
                .leftJoin('lesson.activities', 'activity');
            if (type === ActivityType.ASSIGNMENT) {
                query
                    .leftJoin('activity.assignmentActivity', 'assignmentActivity')
                    .where('assignmentActivity.id = :activityId', { activityId });
            }
            if (type === ActivityType.QUIZ) {
                query
                    .leftJoin('activity.quizActivity', 'quizActivity')
                    .where('quizActivity.id = :activityId', { activityId });
            }
            if (type === ActivityType.VIDEO) {
                query
                    .leftJoin('activity.videoActivity', 'videoActivity')
                    .where('videoActivity.id = :activityId', { activityId });
            }
            if (type === ActivityType.AUDIO) {
                query
                    .leftJoin('activity.audioActivity', 'audioActivity')
                    .where('audioActivity.id = :activityId', { activityId });
            }
            if (type === ActivityType.ARTICLE) {
                query
                    .leftJoin('activity.articleActivity', 'articleActivity')
                    .where('articleActivity.id = :activityId', { activityId });
            }

            return await query.getOne();
        } catch (error) {
            console.log('error', error);
            throw new HttpException('Error, lesson not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async getCourseLessons(courseId: number): Promise<LessonDTO[]> {
        try {
            const lessons = await this.lessonRepository
                .createQueryBuilder('lesson')
                .leftJoin('lesson.section', 'section')
                .leftJoin('section.course', 'course')
                .where('course.id = :id', { id: courseId })
                .orderBy('section.order', 'ASC')
                .addOrderBy('lesson.order', 'ASC')
                .getMany();

            const lessonDTOs = lessons.map(lesson => LessonMapper.fromEntityToDTO(lesson));
            return lessonDTOs;
        } catch (error) {
            console.log('error', error);
            throw new HttpException('Error, getCourseLessons lesson not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async getProgramLessons(programId: number): Promise<LessonDTO[]> {
        try {
            const lessons = await this.lessonRepository
                .createQueryBuilder('lesson')
                .leftJoin('lesson.section', 'section')
                .leftJoin('section.course', 'course')
                .leftJoin('course.relTrackCourses', 'relTrackCourses')
                .leftJoin('relTrackCourses.track', 'track')
                .leftJoin('track.program', 'program')
                .where('program.id = :id', { id: programId })
                .orderBy('track.order', 'ASC')
                .addOrderBy('relTrackCourses.order', 'ASC')
                .addOrderBy('section.order', 'ASC')
                .addOrderBy('lesson.order', 'ASC')
                .getMany();

            const lessonDTOs = lessons.map(lesson => LessonMapper.fromEntityToDTO(lesson));
            return lessonDTOs;
        } catch (error) {
            console.log('error', error);
            throw new HttpException('Error, getCourseLessons lesson not found!', HttpStatus.BAD_REQUEST);
        }
    }
}
