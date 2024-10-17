import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { HtmlActivityMapper } from '../mappers/html-activity.mapper';
import { HtmlActivity } from '../entities/html-activity.entity';
import { HtmlActivityRepository } from '../repositories/html-activity.repository';
import { HtmlActivityDTO } from '../dto/html-activity.dto';

const relationshipNames = [];

@Injectable()
export class HtmlActivityService {
    logger = new Logger('HtmlActivityService');

    private htmlActivityRepository: HtmlActivityRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.htmlActivityRepository = connection.getRepository(HtmlActivity);
        }
    }
    async findById(id: number): Promise<HtmlActivityDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.htmlActivityRepository.findOne(id, options);
        return HtmlActivityMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<HtmlActivityDTO>): Promise<HtmlActivityDTO | undefined> {
        const result = await this.htmlActivityRepository.findOne(options);
        return HtmlActivityMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<HtmlActivityDTO>): Promise<[HtmlActivityDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.htmlActivityRepository.findAndCount(options);
        const htmlActivityDTO: HtmlActivityDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(htmlActivity =>
                htmlActivityDTO.push(HtmlActivityMapper.fromEntityToDTO(htmlActivity)),
            );
            resultList[0] = htmlActivityDTO;
        }
        return resultList;
    }

    async save(htmlActivityDTO: HtmlActivityDTO, creator?: string): Promise<HtmlActivityDTO | undefined> {
        const entity = HtmlActivityMapper.fromDTOtoEntity(htmlActivityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.htmlActivityRepository.save(entity);
        return HtmlActivityMapper.fromEntityToDTO(result);
    }

    async update(htmlActivityDTO: HtmlActivityDTO, updater?: string): Promise<HtmlActivityDTO | undefined> {
        const entity = HtmlActivityMapper.fromDTOtoEntity(htmlActivityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.htmlActivityRepository.save(entity);
        return HtmlActivityMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.htmlActivityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
