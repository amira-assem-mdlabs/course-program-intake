import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { ActivityType } from '../../../common/enumeration/activity-type';
import { ActivityMapper } from '../mappers/activity.mapper';
import { Activity } from '../entities/activity.entity';
import { PageRequest } from '../../../common/entities/pagination.entity';
import { ActivityRepository } from '../repositories/activity.repository';
import { ActivityDTO } from '../dto/activity.dto';
import { QuestionDTO } from '../dto/question.dto';

const relationshipNames = [];
relationshipNames.push('lesson');

@Injectable()
export class ActivityService {
    logger = new Logger('ActivityService');
    private activityRepository: ActivityRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.activityRepository = connection.getRepository(Activity);
        }
    }

    async findByLessonId(lessonId: number): Promise<any> {
        let activities = await this.activityRepository
            .createQueryBuilder('activity')
            .leftJoinAndSelect('activity.lesson', 'lesson')
            .leftJoinAndSelect('activity.videoActivity', 'videoActivity')
            .leftJoinAndSelect('activity.audioActivity', 'audioActivity')
            .leftJoinAndSelect('activity.articleActivity', 'articleActivity')
            .leftJoinAndSelect('activity.htmlActivity', 'htmlActivity')
            .leftJoinAndSelect('activity.assignmentActivity', 'assignmentActivity')
            .leftJoinAndSelect('assignmentActivity.assignmentFiles', 'assignmentFiles')
            .leftJoinAndSelect('activity.quizActivity', 'quizActivity')
            .leftJoinAndSelect('quizActivity.questions', 'question')
            .leftJoinAndSelect('question.shortAnswerQuestion', 'short_answer_question')
            .leftJoinAndSelect('question.trueOrFalseQuestion', 'true_or_false_question')
            .leftJoinAndSelect('question.mcqQuestion', 'mcq_question')
            .leftJoinAndSelect('mcq_question.mcqChoices', 'mcq_choice')
            .where('lesson.id = :id', { id: lessonId })
            .orderBy('activity.order', 'ASC')
            .getMany();

        return activities;
    }

    shuffleQuestions(questions: QuestionDTO[]) {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        return questions;
    }

    async findByFieldsV2(filters: any, courseId: number, pageRequest: PageRequest): Promise<any> {
        const query = this.activityRepository
            .createQueryBuilder('activity')
            .leftJoin('activity.lesson', 'lesson')
            .leftJoin('lesson.section', 'section')
            .leftJoin('section.course', 'course')
            .where('course.id = :courseId', { courseId });

        Object.keys(filters).forEach(key => {
            query.andWhere(`activity.${key} = :${key}`, { [key]: filters[key] });
            if (key === 'type') {
                if (filters[key] === ActivityType.QUIZ) {
                    query.leftJoinAndSelect('activity.quizActivity', 'quizActivity');
                } else {
                    query.leftJoinAndSelect('activity.assignmentActivity', 'assignmentActivity');
                }
            }
        });

        const count = await query.getCount();
        const result = await query
            .skip(pageRequest.page * pageRequest.size)
            .take(pageRequest.size)
            .orderBy(`activity.${pageRequest.sort.property}`, pageRequest.sort.direction === 'ASC' ? 'ASC' : 'DESC')
            .getMany();

        return [result, count];
    }

    async findById(id: number, options?: FindManyOptions<ActivityDTO>): Promise<ActivityDTO | undefined> {
        if (options?.relations) {
            options.relations = [...options.relations, ...relationshipNames];
        } else {
            options = { relations: relationshipNames };
        }

        const result = await this.activityRepository.findOne(id, options);
        return ActivityMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ActivityDTO>): Promise<ActivityDTO | undefined> {
        const result = await this.activityRepository.findOne(options);
        return ActivityMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ActivityDTO>): Promise<[ActivityDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.activityRepository.findAndCount(options);
        const activityDTO: ActivityDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(activity => activityDTO.push(ActivityMapper.fromEntityToDTO(activity)));
            resultList[0] = activityDTO;
        }
        return resultList;
    }

    async save(activityDTO: any, creator?: string): Promise<ActivityDTO | undefined> {
        const [, num] = await this.findAndCount({ where: { lesson: activityDTO.lesson.id } });
        const entity = ActivityMapper.fromDTOtoEntity(activityDTO);
        entity.order = num + 1;
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.activityRepository.save(entity);
        return ActivityMapper.fromEntityToDTO(result);
    }

    async update(activityDTO: ActivityDTO, updater?: string): Promise<ActivityDTO | undefined> {
        const entity = ActivityMapper.fromDTOtoEntity(activityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.activityRepository.save(entity);
        return ActivityMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.activityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
