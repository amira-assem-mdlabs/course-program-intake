import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { VideoActivityMapper } from '../mappers/video-activity.mapper';
import { VideoActivity } from '../entities/video-activity.entity';
import { VideoActivityRepository } from '../repositories/video-activity.repository';
import { VideoActivityDTO } from '../dto/video-activity.dto';

const relationshipNames = [];

@Injectable()
export class VideoActivityService {
    logger = new Logger('VideoActivityService');
    private videoActivityRepository: VideoActivityRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.videoActivityRepository = connection.getRepository(VideoActivity);
        }
    }

    async findById(id: number): Promise<VideoActivityDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.videoActivityRepository.findOne(id, options);
        return VideoActivityMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<VideoActivityDTO>): Promise<VideoActivityDTO | undefined> {
        const result = await this.videoActivityRepository.findOne(options);
        return VideoActivityMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<VideoActivityDTO>): Promise<[VideoActivityDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.videoActivityRepository.findAndCount(options);
        const videoActivityDTO: VideoActivityDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(videoActivity =>
                videoActivityDTO.push(VideoActivityMapper.fromEntityToDTO(videoActivity)),
            );
            resultList[0] = videoActivityDTO;
        }
        return resultList;
    }

    async save(videoActivityDTO: VideoActivityDTO, creator?: string): Promise<VideoActivityDTO | undefined> {
        const entity = VideoActivityMapper.fromDTOtoEntity(videoActivityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.videoActivityRepository.save(entity);
        return VideoActivityMapper.fromEntityToDTO(result);
    }

    async update(videoActivityDTO: VideoActivityDTO, updater?: string): Promise<VideoActivityDTO | undefined> {
        const entity = VideoActivityMapper.fromDTOtoEntity(videoActivityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.videoActivityRepository.save(entity);
        return VideoActivityMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.videoActivityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
