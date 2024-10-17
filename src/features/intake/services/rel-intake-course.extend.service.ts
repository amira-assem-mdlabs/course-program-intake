import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';

import { RelIntakeCourseMapper } from '../mappers/rel-intake-course.mapper';

import { RelIntakeCourseRepository } from '../repositories/rel-intake-course.repository';
import { CourseDTO } from '../../course/dto/course.dto';
import { RelIntakeCourseDTO } from '../dto/rel-intake-course.dto';
import { RelIntakeCourse } from '../entities/rel-intake-course.entity';

const relationshipNames = [];
relationshipNames.push('course');
relationshipNames.push('intake');

@Injectable()
export class RelIntakeCourseExtendService {
    logger = new Logger('RelIntakeCourseExtendService');
    private relIntakeCourseRepository: RelIntakeCourseRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relIntakeCourseRepository = connection.getRepository(RelIntakeCourse);
        }
    }

    async findById(id: number): Promise<RelIntakeCourseDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relIntakeCourseRepository.findOne(id, options);
        return RelIntakeCourseMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelIntakeCourseDTO>): Promise<RelIntakeCourseDTO | undefined> {
        const result = await this.relIntakeCourseRepository.findOne(options);
        return RelIntakeCourseMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelIntakeCourseDTO>): Promise<[RelIntakeCourseDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.relIntakeCourseRepository.findAndCount(options);
        const relIntakeCourseDTO: RelIntakeCourseDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(relIntakeCourse =>
                relIntakeCourseDTO.push(RelIntakeCourseMapper.fromEntityToDTO(relIntakeCourse)),
            );
            resultList[0] = relIntakeCourseDTO;
        }
        return resultList;
    }

    async findAllIntakeCourses(course: CourseDTO): Promise<RelIntakeCourse[]> {
        return await this.relIntakeCourseRepository
            .createQueryBuilder('relIntakeCourse')
            .leftJoin('relIntakeCourse.course', 'course')
            .leftJoinAndSelect('relIntakeCourse.intake', 'intake')
            .where('course.id = :id', { id: course.id })
            .orderBy('intake.learningStartDate', 'ASC')
            .getMany();
    }

    async findAndCountOngoingIntakes(courseId: number): Promise<[RelIntakeCourse[], number]> {
        const today = new Date().toISOString().split('T')[0];

        return await this.relIntakeCourseRepository
            .createQueryBuilder('relIntakeCourse')
            .leftJoinAndSelect('relIntakeCourse.course', 'course')
            .where('course.id = :id', { id: courseId })
            .leftJoinAndSelect('relIntakeCourse.intake', 'intake')
            .andWhere('intake.learningEndDate > :today', { today })
            .getManyAndCount();
    }

    async save(relIntakeCourseDTO: RelIntakeCourseDTO, creator?: string): Promise<RelIntakeCourseDTO | undefined> {
        const entity = RelIntakeCourseMapper.fromDTOtoEntity(relIntakeCourseDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relIntakeCourseRepository.save(entity);
        return RelIntakeCourseMapper.fromEntityToDTO(result);
    }

    async update(relIntakeCourseDTO: RelIntakeCourseDTO, updater?: string): Promise<RelIntakeCourseDTO | undefined> {
        const entity = RelIntakeCourseMapper.fromDTOtoEntity(relIntakeCourseDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relIntakeCourseRepository.save(entity);
        return RelIntakeCourseMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relIntakeCourseRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async findAllIntakesForEntity(entityId: number): Promise<[RelIntakeCourseDTO[], number]> {
        return await this.relIntakeCourseRepository
            .createQueryBuilder('relIntakeCourse')
            .innerJoin('relIntakeCourse.course', 'course')
            .innerJoin('relIntakeCourse.intake', 'intake')
            .where('course.id = :id', { id: entityId })
            .orderBy('intake.learningStartDate', 'ASC')
            .getManyAndCount();
    }
}
