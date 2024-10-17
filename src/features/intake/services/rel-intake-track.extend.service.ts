import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';

import { RelIntakeTrackRepository } from '../repositories/rel-intake-track.repository';
import { RelIntakeTrackDTO } from '../dto/rel-intake-track.dto';
import { RelIntakeTrack } from '../entities/rel-intake-track.entity';
import { RelIntakeTrackMapper } from '../mappers/rel-intake-track.mapper';

const relationshipNames = [];
relationshipNames.push('track');
relationshipNames.push('intake');

@Injectable()
export class RelIntakeTrackService {
    logger = new Logger('RelIntakeTrackService');
    private relIntakeTrackRepository: RelIntakeTrackRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relIntakeTrackRepository = connection.getRepository(RelIntakeTrack);
        }
    }

    async findById(id: number): Promise<RelIntakeTrackDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relIntakeTrackRepository.findOne(id, options);
        return RelIntakeTrackMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelIntakeTrackDTO>): Promise<RelIntakeTrackDTO | undefined> {
        const result = await this.relIntakeTrackRepository.findOne(options);
        return RelIntakeTrackMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelIntakeTrackDTO>): Promise<[RelIntakeTrackDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.relIntakeTrackRepository.findAndCount(options);
        const relIntakeTrackDTO: RelIntakeTrackDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(relIntakeTrack =>
                relIntakeTrackDTO.push(RelIntakeTrackMapper.fromEntityToDTO(relIntakeTrack)),
            );
            resultList[0] = relIntakeTrackDTO;
        }
        return resultList;
    }

    async save(relIntakeTrackDTO: RelIntakeTrackDTO, creator?: string): Promise<RelIntakeTrackDTO | undefined> {
        const entity = RelIntakeTrackMapper.fromDTOtoEntity(relIntakeTrackDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relIntakeTrackRepository.save(entity);
        return RelIntakeTrackMapper.fromEntityToDTO(result);
    }

    async update(relIntakeTrackDTO: RelIntakeTrackDTO, updater?: string): Promise<RelIntakeTrackDTO | undefined> {
        const entity = RelIntakeTrackMapper.fromDTOtoEntity(relIntakeTrackDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relIntakeTrackRepository.save(entity);
        return RelIntakeTrackMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relIntakeTrackRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
