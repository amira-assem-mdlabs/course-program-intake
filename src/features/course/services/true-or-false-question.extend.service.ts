import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { TrueOrFalseQuestionMapper } from '../mappers/true-or-false-question.mapper';
import { TrueOrFalseQuestion } from '../entities/true-or-false-question.entity';
import { TrueOrFalseQuestionRepository } from '../repositories/true-or-false-question.repository';
import { TrueOrFalseQuestionDTO } from '../dto/true-or-false-question.dto';

const relationshipNames = [];

@Injectable()
export class TrueOrFalseQuestionService {
    logger = new Logger('TrueOrFalseQuestionService');
    private trueOrFalseQuestionRepository: TrueOrFalseQuestionRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.trueOrFalseQuestionRepository = connection.getRepository(TrueOrFalseQuestion);
        }
    }
    async findById(id: number): Promise<TrueOrFalseQuestionDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.trueOrFalseQuestionRepository.findOne(id, options);
        return TrueOrFalseQuestionMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TrueOrFalseQuestionDTO>): Promise<TrueOrFalseQuestionDTO | undefined> {
        const result = await this.trueOrFalseQuestionRepository.findOne(options);
        return TrueOrFalseQuestionMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<TrueOrFalseQuestionDTO>): Promise<[TrueOrFalseQuestionDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.trueOrFalseQuestionRepository.findAndCount(options);
        const trueOrFalseQuestionDTO: TrueOrFalseQuestionDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(trueOrFalseQuestion =>
                trueOrFalseQuestionDTO.push(TrueOrFalseQuestionMapper.fromEntityToDTO(trueOrFalseQuestion)),
            );
            resultList[0] = trueOrFalseQuestionDTO;
        }
        return resultList;
    }

    async save(
        trueOrFalseQuestionDTO: TrueOrFalseQuestionDTO,
        creator?: string,
    ): Promise<TrueOrFalseQuestionDTO | undefined> {
        const entity = TrueOrFalseQuestionMapper.fromDTOtoEntity(trueOrFalseQuestionDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.trueOrFalseQuestionRepository.save(entity);
        return TrueOrFalseQuestionMapper.fromEntityToDTO(result);
    }

    async update(
        trueOrFalseQuestionDTO: TrueOrFalseQuestionDTO,
        updater?: string,
    ): Promise<TrueOrFalseQuestionDTO | undefined> {
        const entity = TrueOrFalseQuestionMapper.fromDTOtoEntity(trueOrFalseQuestionDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.trueOrFalseQuestionRepository.save(entity);
        return TrueOrFalseQuestionMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.trueOrFalseQuestionRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
