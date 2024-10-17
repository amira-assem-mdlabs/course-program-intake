import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { RelTrackCourseDTO } from '../dto/rel-track-course.dto';
import { RelTrackCourse } from '../entities/rel-track-course.entity';
import { RelTrackCourseRepository } from '../repositories/rel-track-course.repository';
import { RelTrackCourseMapper } from '../mappers/rel-track-course.mapper';

const relationshipNames = [];
relationshipNames.push('track');
relationshipNames.push('course');

@Injectable()
export class RelTrackCourseExtendService {
    logger = new Logger('RelTrackCourseExtendService');
    private relTrackCourseRepository: RelTrackCourseRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relTrackCourseRepository = connection.getRepository(RelTrackCourse);
        }
    }

    async findById(id: number): Promise<RelTrackCourseDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relTrackCourseRepository.findOne(id, options);
        return RelTrackCourseMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelTrackCourseDTO>): Promise<RelTrackCourseDTO | undefined> {
        const result = await this.relTrackCourseRepository.findOne(options);
        return RelTrackCourseMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelTrackCourseDTO>): Promise<[RelTrackCourseDTO[], number]> {
        options.relations = relationshipNames;
        const [results, count] = await this.relTrackCourseRepository.findAndCount(options);
        const relTrackCourseDTO: RelTrackCourseDTO[] = results.map(relTrackCourse =>
            RelTrackCourseMapper.fromEntityToDTO(relTrackCourse),
        );
        return [relTrackCourseDTO, count];
    }

    async save(relTrackCourseDTO: RelTrackCourseDTO, creator?: string): Promise<RelTrackCourseDTO | undefined> {
        const entity = RelTrackCourseMapper.fromDTOtoEntity(relTrackCourseDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relTrackCourseRepository.save(entity);
        return RelTrackCourseMapper.fromEntityToDTO(result);
    }

    async update(relTrackCourseDTO: RelTrackCourseDTO, updater?: string): Promise<RelTrackCourseDTO | undefined> {
        const entity = RelTrackCourseMapper.fromDTOtoEntity(relTrackCourseDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relTrackCourseRepository.save(entity);
        return RelTrackCourseMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relTrackCourseRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async findAllProgramCourses(id: number): Promise<number[]> {
        const query = this.relTrackCourseRepository
            .createQueryBuilder('relTrackCourses')
            .innerJoinAndSelect('relTrackCourses.course', 'course')
            .innerJoinAndSelect('relTrackCourses.track', 'track')
            .innerJoinAndSelect('track.program', 'program')
            .where('program.id = :id', { id });

        const filteredCourses = await query.getMany();

        const coursesIds: number[] = [];

        filteredCourses.map(relTrackCourse => coursesIds.push(relTrackCourse.course.id));

        return coursesIds;
    }
}
