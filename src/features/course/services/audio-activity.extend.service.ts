import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { AudioActivityMapper } from '../mappers/audio-activity.mapper';
import { AudioActivity } from '../entities/audio-activity.entity';
import { AudioActivityRepository } from '../repositories/audio-activity.repository';
import { AudioActivityDTO } from '../dto/audio-activity.dto';

const relationshipNames = [];

@Injectable()
export class AudioActivityService {
    logger = new Logger('AudioActivityService');
    private audioActivityRepository: AudioActivityRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.audioActivityRepository = connection.getRepository(AudioActivity);
        }
    }

    async findById(id: number): Promise<AudioActivityDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.audioActivityRepository.findOne(id, options);
        return AudioActivityMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AudioActivityDTO>): Promise<AudioActivityDTO | undefined> {
        const result = await this.audioActivityRepository.findOne(options);
        return AudioActivityMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AudioActivityDTO>): Promise<[AudioActivityDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.audioActivityRepository.findAndCount(options);
        const audioActivityDTO: AudioActivityDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(audioActivity =>
                audioActivityDTO.push(AudioActivityMapper.fromEntityToDTO(audioActivity)),
            );
            resultList[0] = audioActivityDTO;
        }
        return resultList;
    }

    async save(audioActivityDTO: AudioActivityDTO, creator?: string): Promise<AudioActivityDTO | undefined> {
        const entity = AudioActivityMapper.fromDTOtoEntity(audioActivityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.audioActivityRepository.save(entity);
        return AudioActivityMapper.fromEntityToDTO(result);
    }

    async update(audioActivityDTO: AudioActivityDTO, updater?: string): Promise<AudioActivityDTO | undefined> {
        const entity = AudioActivityMapper.fromDTOtoEntity(audioActivityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.audioActivityRepository.save(entity);
        return AudioActivityMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.audioActivityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
