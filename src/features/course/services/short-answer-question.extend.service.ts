import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { ShortAnswerQuestionMapper } from '../mappers/short-answer-question.mapper';
import { ShortAnswerQuestion } from '../entities/short-answer-question.entity';
import { ShortAnswerQuestionRepository } from '../repositories/short-answer-question.repository';
import { ShortAnswerQuestionDTO } from '../dto/short-answer-question.dto';

const relationshipNames = [];

@Injectable()
export class ShortAnswerQuestionService {
    logger = new Logger('ShortAnswerQuestionService');
    private shortAnswerQuestionRepository: ShortAnswerQuestionRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.shortAnswerQuestionRepository = connection.getRepository(ShortAnswerQuestion);
        }
    }
    async findById(id: number): Promise<ShortAnswerQuestionDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.shortAnswerQuestionRepository.findOne(id, options);
        return ShortAnswerQuestionMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ShortAnswerQuestionDTO>): Promise<ShortAnswerQuestionDTO | undefined> {
        const result = await this.shortAnswerQuestionRepository.findOne(options);
        return ShortAnswerQuestionMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ShortAnswerQuestionDTO>): Promise<[ShortAnswerQuestionDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.shortAnswerQuestionRepository.findAndCount(options);
        const shortAnswerQuestionDTO: ShortAnswerQuestionDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(shortAnswerQuestion =>
                shortAnswerQuestionDTO.push(ShortAnswerQuestionMapper.fromEntityToDTO(shortAnswerQuestion)),
            );
            resultList[0] = shortAnswerQuestionDTO;
        }
        return resultList;
    }

    async save(
        shortAnswerQuestionDTO: ShortAnswerQuestionDTO,
        creator?: string,
    ): Promise<ShortAnswerQuestionDTO | undefined> {
        const entity = ShortAnswerQuestionMapper.fromDTOtoEntity(shortAnswerQuestionDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.shortAnswerQuestionRepository.save(entity);
        return ShortAnswerQuestionMapper.fromEntityToDTO(result);
    }

    async update(
        shortAnswerQuestionDTO: ShortAnswerQuestionDTO,
        updater?: string,
    ): Promise<ShortAnswerQuestionDTO | undefined> {
        const entity = ShortAnswerQuestionMapper.fromDTOtoEntity(shortAnswerQuestionDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.shortAnswerQuestionRepository.save(entity);
        return ShortAnswerQuestionMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.shortAnswerQuestionRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
