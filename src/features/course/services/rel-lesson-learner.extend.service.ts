import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { RelLessonLearnerMapper } from '../mappers/rel-lesson-learner.mapper';
import { Lesson } from '../entities/lesson.entity';
import { RelLessonLearner } from '../entities/rel-lesson-learner.entity';
import { Section } from '../entities/section.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { RelLessonLearnerRepository } from '../repositories/rel-lesson-learner.repository';
import { SectionRepository } from '../repositories/section.repository';
import { RelLessonLearnerDTO } from '../dto/rel-lesson-learner.dto';

const relationshipNames = [];
relationshipNames.push('learner');
relationshipNames.push('lesson');

@Injectable()
export class RelLessonLearnerService {
    logger = new Logger('RelLessonLearnerService');

    private relLessonLearnerRepository: RelLessonLearnerRepository;
    private sectionRepository: SectionRepository;
    private lessonRepository: LessonRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relLessonLearnerRepository = connection.getRepository(RelLessonLearner);
            this.sectionRepository = connection.getRepository(Section);
            this.lessonRepository = connection.getRepository(Lesson);
        }
    }

    async findById(id: number): Promise<RelLessonLearnerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relLessonLearnerRepository.findOne(id, options);
        return RelLessonLearnerMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelLessonLearnerDTO>): Promise<RelLessonLearnerDTO | undefined> {
        const result = await this.relLessonLearnerRepository.findOne(options);
        return RelLessonLearnerMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelLessonLearnerDTO>): Promise<[RelLessonLearnerDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.relLessonLearnerRepository.findAndCount(options);
        const relLessonLearnerDTO: RelLessonLearnerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(relLessonLearner =>
                relLessonLearnerDTO.push(RelLessonLearnerMapper.fromEntityToDTO(relLessonLearner)),
            );
            resultList[0] = relLessonLearnerDTO;
        }
        return resultList;
    }

    async save(relLessonLearnerDTO: RelLessonLearnerDTO, creator?: string): Promise<RelLessonLearnerDTO | undefined> {
        const entity = RelLessonLearnerMapper.fromDTOtoEntity(relLessonLearnerDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relLessonLearnerRepository.save(entity);
        return RelLessonLearnerMapper.fromEntityToDTO(result);
    }

    async update(relLessonLearnerDTO: RelLessonLearnerDTO, updater?: string): Promise<RelLessonLearnerDTO | undefined> {
        const entity = RelLessonLearnerMapper.fromDTOtoEntity(relLessonLearnerDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relLessonLearnerRepository.save(entity);
        return RelLessonLearnerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relLessonLearnerRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async getLearnerCompletedLessonsInCourse(id: number, learnerId: number): Promise<number> {
        try {
            const result = await this.relLessonLearnerRepository
                .createQueryBuilder('relLessonLearner')
                .leftJoin('relLessonLearner.learner', 'learner')
                .leftJoin('relLessonLearner.lesson', 'lesson')
                .leftJoin('lesson.section', 'section')
                .leftJoin('section.course', 'course')
                .select(['learner.id', 'lesson.id'])
                .distinct(true)
                .where('course.id = :id', { id })
                .andWhere('learner.id = :learnerId', { learnerId })
                .getRawMany();

            return result.length;
        } catch (error) {
            throw new HttpException('Error, relLessonLearner not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async getNextLessonForLearner(
        courseSlug: string,
        learnerId: number,
    ): Promise<{ sectionIndex: number; nextLessonIndex: number }> {
        try {
            const lastCompletedLesson = await this.getLastCompletedLesson(courseSlug, learnerId);

            if (!lastCompletedLesson) {
                return;
            }

            const section = lastCompletedLesson.lesson.section;

            const nextLessonInSection = await this.getNextLessonInSection(section, lastCompletedLesson.lesson);

            if (nextLessonInSection) {
                return {
                    sectionIndex: await this.getSectionIndex(courseSlug, nextLessonInSection.section.id),
                    nextLessonIndex: await this.getLessonIndex(nextLessonInSection.section.id, nextLessonInSection.id),
                };
            } else {
                const nextSection = await this.getNextSection(courseSlug, section);

                if (nextSection) {
                    const firstLessonOfNextSection = await this.getFirstLessonOfSection(nextSection);

                    if (firstLessonOfNextSection) {
                        return {
                            sectionIndex: await this.getSectionIndex(courseSlug, nextSection.id),
                            nextLessonIndex: await this.getLessonIndex(nextSection.id, firstLessonOfNextSection.id),
                        };
                    }
                    return {
                        sectionIndex: 0,
                        nextLessonIndex: 0,
                    };
                } else {
                    return;
                }
            }
        } catch (error) {
            console.log('error in getNextLessonForLearner', error);
            throw new HttpException('Error occurred while fetching next lesson!', HttpStatus.BAD_REQUEST);
        }
    }

    async getLastCompletedLesson(courseSlug: string, learnerId: number) {
        return await this.relLessonLearnerRepository
            .createQueryBuilder('relLessonLearner')
            .leftJoin('relLessonLearner.learner', 'learner')
            .leftJoinAndSelect('relLessonLearner.lesson', 'lesson')
            .leftJoinAndSelect('lesson.section', 'section')
            .leftJoin('section.course', 'course')
            .where('course.slug = :slug', { slug: courseSlug })
            .andWhere('learner.id = :learnerId', { learnerId })
            .orderBy('relLessonLearner.id', 'DESC')
            .getOne();
    }

    private async getNextLessonInSection(section: Section, lastCompletedLesson: Lesson) {
        return await this.lessonRepository
            .createQueryBuilder('lesson')
            .leftJoinAndSelect('lesson.section', 'section')
            .where('section.id = :sectionId', { sectionId: section.id })
            .andWhere('lesson.order > :order', { order: lastCompletedLesson.order })
            .orderBy('lesson.order', 'ASC')
            .getOne();
    }

    private async getNextSection(courseSlug: string, section: Section) {
        return await this.sectionRepository
            .createQueryBuilder('section')
            .leftJoin('section.course', 'course')
            .where('course.slug = :slug', { slug: courseSlug })
            .andWhere('section.order > :order', { order: section.order })
            .orderBy('section.order', 'ASC')
            .getOne();
    }

    private async getFirstLessonOfSection(section: Section) {
        return await this.lessonRepository.findOne({
            where: { section: { id: section.id } },
            order: { order: 'ASC' },
        });
    }

    private async getSectionIndex(courseSlug: string, sectionId: number) {
        const sections = await this.sectionRepository
            .createQueryBuilder('section')
            .leftJoin('section.course', 'course')
            .where('course.slug = :slug', { slug: courseSlug })
            .orderBy('section.order', 'ASC')
            .getMany();

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (section.id === sectionId) {
                return i;
            }
        }
    }

    private async getLessonIndex(sectionId: number, lessonId: number) {
        const lessons = await this.lessonRepository
            .createQueryBuilder('lesson')
            .leftJoin('lesson.section', 'section')
            .where('section.id = :id', { id: sectionId })
            .getMany();

        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            if (lesson.id === lessonId) {
                return i;
            }
        }
    }
}
