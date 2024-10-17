import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { ArticleActivityMapper } from '../mappers/article-activity.mapper';
import { ArticleActivity } from '../entities/article-activity.entity';
import { ArticleActivityRepository } from '../repositories/article-activity.repository';
import { ArticleActivityDTO } from '../dto/article-activity.dto';

const relationshipNames = [];

@Injectable()
export class ArticleActivityService {
    logger = new Logger('ArticleActivityService');
    private articleActivityRepository: ArticleActivityRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.articleActivityRepository = connection.getRepository(ArticleActivity);
        }
    }

    async findById(id: number): Promise<ArticleActivityDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.articleActivityRepository.findOne(id, options);
        return ArticleActivityMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ArticleActivityDTO>): Promise<ArticleActivityDTO | undefined> {
        const result = await this.articleActivityRepository.findOne(options);
        return ArticleActivityMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ArticleActivityDTO>): Promise<[ArticleActivityDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.articleActivityRepository.findAndCount(options);
        const articleActivityDTO: ArticleActivityDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(articleActivity =>
                articleActivityDTO.push(ArticleActivityMapper.fromEntityToDTO(articleActivity)),
            );
            resultList[0] = articleActivityDTO;
        }
        return resultList;
    }

    async save(articleActivityDTO: ArticleActivityDTO, creator?: string): Promise<ArticleActivityDTO | undefined> {
        const entity = ArticleActivityMapper.fromDTOtoEntity(articleActivityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.articleActivityRepository.save(entity);
        return ArticleActivityMapper.fromEntityToDTO(result);
    }

    async update(articleActivityDTO: ArticleActivityDTO, updater?: string): Promise<ArticleActivityDTO | undefined> {
        const entity = ArticleActivityMapper.fromDTOtoEntity(articleActivityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.articleActivityRepository.save(entity);
        return ArticleActivityMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.articleActivityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
