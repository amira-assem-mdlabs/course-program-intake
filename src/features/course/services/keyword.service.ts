import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { KeywordRepository } from '../repositories/keyword.repository';
import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { KeywordMapper } from '../mappers/keyword.mapper';
import { Keyword } from '../entities/keyword.entity';
import { KeywordDTO } from '../dto/keyword.dto';

const relationshipNames = [];

@Injectable()
export class KeywordService {
    logger = new Logger('KeywordService');

    private keywordRepository: KeywordRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.keywordRepository = connection.getRepository(Keyword);
        }
    }

    async findById(id: number): Promise<KeywordDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.keywordRepository.findOne(id, options);
        return KeywordMapper.fromEntityToDTO(result);
    }
    async addMany(keywords: any, creator?: string): Promise<any> {
        const results = await this.keywordRepository
            .createQueryBuilder()
            .insert()
            .values([...keywords])
            .orUpdate({ conflict_target: ['name'], overwrite: ['name'] })
            .execute();
        return results.identifiers;
    }
    async findByFields(options: FindOneOptions<KeywordDTO>): Promise<KeywordDTO | undefined> {
        const result = await this.keywordRepository.findOne(options);
        return KeywordMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<KeywordDTO>): Promise<[KeywordDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.keywordRepository.findAndCount(options);
        const keywordDTO: KeywordDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(keyword => keywordDTO.push(KeywordMapper.fromEntityToDTO(keyword)));
            resultList[0] = keywordDTO;
        }
        return resultList;
    }

    async save(keywordDTO: KeywordDTO, creator?: string): Promise<KeywordDTO | undefined> {
        const entity = KeywordMapper.fromDTOtoEntity(keywordDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.keywordRepository.save(entity);
        return KeywordMapper.fromEntityToDTO(result);
    }

    async update(keywordDTO: KeywordDTO, updater?: string): Promise<KeywordDTO | undefined> {
        const entity = KeywordMapper.fromDTOtoEntity(keywordDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.keywordRepository.save(entity);
        return KeywordMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.keywordRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
