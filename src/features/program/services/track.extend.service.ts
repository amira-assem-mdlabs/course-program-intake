import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { TrackDTO } from '../dto/track.dto';
import { Track } from '../entities/track.entity';
import { TrackRepository } from '../repositories/track.repository';
import { TrackMapper } from '../mappers/track.mapper';

const relationshipNames = [];
relationshipNames.push('program');

@Injectable()
export class TrackService {
    logger = new Logger('TrackService');
    private trackRepository: TrackRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.trackRepository = connection.getRepository(Track);
        }
    }

    async findById(id: number): Promise<TrackDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.trackRepository.findOne(id, options);
        return TrackMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TrackDTO>): Promise<TrackDTO | undefined> {
        const result = await this.trackRepository.findOne(options);
        return TrackMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<TrackDTO>): Promise<[TrackDTO[], number]> {
        options.relations = relationshipNames;
        const [results, count] = await this.trackRepository.findAndCount(options);
        const trackDTO: TrackDTO[] = results.map(track => TrackMapper.fromEntityToDTO(track));
        return [trackDTO, count];
    }

    async findByProgramId(id: number): Promise<[TrackDTO[], number]> {
        const query = this.trackRepository
            .createQueryBuilder('track')
            .leftJoinAndSelect('track.program', 'program')
            .leftJoinAndSelect('track.relTrackCourses', 'relTrackCourses')
            .leftJoinAndSelect('relTrackCourses.course', 'course')
            .where('program.id = :id', { id })
            .orderBy('program.id', 'ASC')
            .addOrderBy('track.order', 'ASC')
            .addOrderBy('relTrackCourses.order', 'ASC');

        const result = await query.getMany();
        const count = await query.getCount();

        return [result, count];
    }

    async save(trackDTO: TrackDTO, creator?: string): Promise<TrackDTO | undefined> {
        const entity = TrackMapper.fromDTOtoEntity(trackDTO);
        const [, count] = await this.findByProgramId(trackDTO.program.id);
        entity.order = count + 1;

        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }

        const result = await this.trackRepository.save(entity);
        return TrackMapper.fromEntityToDTO(result);
    }

    async update(trackDTO: TrackDTO, updater?: string): Promise<TrackDTO | undefined> {
        const entity = TrackMapper.fromDTOtoEntity(trackDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.trackRepository.save(entity);
        return TrackMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.trackRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async getTracksInPrograms(programIds: number[]): Promise<TrackDTO[]> {
        let result = await this.trackRepository
            .createQueryBuilder('track')
            .leftJoinAndSelect('track.program', 'program')
            .leftJoinAndSelect('track.relTrackCourses', 'relTrackCourses')
            .leftJoinAndSelect('relTrackCourses.course', 'course')
            .where('program.id IN (:...programIds)', { programIds })
            .getMany();

        return result;
    }
}
