import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { SectionMapper } from '../mappers/section.mapper';
import { Section } from '../entities/section.entity';
import { SectionRepository } from '../repositories/section.repository';
import { SectionDTO } from '../dto/section.dto';

const relationshipNames = [];
relationshipNames.push('course');

@Injectable()
export class SectionService {
    logger = new Logger('SectionService');
    private sectionRepository: SectionRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.sectionRepository = connection.getRepository(Section);
        }
    }

    async findById(id: number): Promise<SectionDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.sectionRepository.findOne(id, options);
        return SectionMapper.fromEntityToDTO(result);
    }

    async findByCourseId(courseId: number): Promise<any> {
        let result = await this.sectionRepository
            .createQueryBuilder('section')
            .leftJoinAndSelect('section.course', 'course')
            .leftJoinAndSelect('section.lessons', 'lessons')
            .where('course.id = :id', { id: courseId })
            .orderBy('section.order', 'ASC')
            .getMany();
        return result;
    }

    // async getByCourseSlug(slug: string): Promise<SectionReportDTO[]> {
    //     return await this.sectionRepository
    //         .createQueryBuilder('section')
    //         .leftJoin('section.course', 'course')
    //         .leftJoin('section.lessons', 'lesson')
    //         .where('course.slug = :slug', { slug })
    //         .select('section.name', 'name')
    //         .addSelect('section.slug', 'slug')
    //         .addSelect('section.id', 'id')
    //         .addSelect('section.order', 'order')
    //         .addSelect('COUNT(DISTINCT lesson.id)::INTEGER', 'lessonCount')
    //         .addGroupBy('section.slug')
    //         .addGroupBy('section.name')
    //         .addGroupBy('section.id')
    //         .addGroupBy('section.order')
    //         .orderBy('section.order', 'ASC')
    //         .getRawMany();
    // }

    // async getSectionsLessons(sectionId: number, learnerId: number): Promise<LessonReportDTO[]> {
    //     return await this.sectionRepository
    //         .createQueryBuilder('section')
    //         .leftJoinAndSelect('section.lessons', 'lesson')
    //         .leftJoinAndSelect(
    //             'lesson.relLessonLearners',
    //             'relLessonLearner',
    //             'relLessonLearner.lessonId = lesson.id AND relLessonLearner.learnerId = :learnerId',
    //             { learnerId },
    //         )
    //         .where('section.id = :id', { id: sectionId })
    //         .orderBy('lesson.order', 'ASC')
    //         .select('lesson.name', 'name')
    //         .addSelect('lesson.slug', 'slug')
    //         .addSelect('lesson.id', 'id')
    //         .addSelect('lesson.order', 'order')
    //         .addSelect(`CASE WHEN relLessonLearner.id IS NULL THEN FALSE ELSE TRUE END`, 'isCompleted')
    //         .getRawMany();
    // }

    async findByFields(options: FindOneOptions<SectionDTO>): Promise<SectionDTO | undefined> {
        const result = await this.sectionRepository.findOne(options);
        return SectionMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<SectionDTO>): Promise<[SectionDTO[], number]> {
        options.relations = relationshipNames;
        const [sections, count] = await this.sectionRepository.findAndCount(options);
        const sectionDTOs: SectionDTO[] = sections.map(section => SectionMapper.fromEntityToDTO(section));
        return [sectionDTOs, count];
    }

    async save(sectionDTO: SectionDTO, creator?: string): Promise<SectionDTO | undefined> {
        const [, num] = await this.findAndCount({ where: { course: sectionDTO.course.id } });
        const entity = SectionMapper.fromDTOtoEntity(sectionDTO);
        entity.order = num + 1;
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.sectionRepository.save(entity);
        return SectionMapper.fromEntityToDTO(result);
    }

    async update(sectionDTO: SectionDTO, updater?: string): Promise<SectionDTO | undefined> {
        const entity = SectionMapper.fromDTOtoEntity(sectionDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.sectionRepository.save(entity);
        return SectionMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.sectionRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
