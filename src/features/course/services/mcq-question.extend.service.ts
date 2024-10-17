import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { McqQuestionMapper } from '../mappers/mcq-question.mapper';
import { McqQuestion } from '../entities/mcq-question.entity';
import { McqQuestionRepository } from '../repositories/mcq-question.repository';
import { McqQuestionDTO } from '../dto/mcq-question.dto';

const relationshipNames = [];

@Injectable()
export class McqQuestionService {
    logger = new Logger('McqQuestionService');
    private mcqQuestionRepository: McqQuestionRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.mcqQuestionRepository = connection.getRepository(McqQuestion);
        }
    }

    async findById(id: number): Promise<McqQuestionDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.mcqQuestionRepository.findOne(id, options);
        return McqQuestionMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<McqQuestionDTO>): Promise<McqQuestionDTO | undefined> {
        const result = await this.mcqQuestionRepository.findOne(options);
        return McqQuestionMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<McqQuestionDTO>): Promise<[McqQuestionDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.mcqQuestionRepository.findAndCount(options);
        const mcqQuestionDTO: McqQuestionDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(mcqQuestion => mcqQuestionDTO.push(McqQuestionMapper.fromEntityToDTO(mcqQuestion)));
            resultList[0] = mcqQuestionDTO;
        }
        return resultList;
    }

    async save(mcqQuestionDTO: McqQuestionDTO, creator?: string): Promise<McqQuestionDTO | undefined> {
        const entity = McqQuestionMapper.fromDTOtoEntity(mcqQuestionDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.mcqQuestionRepository.save(entity);
        return McqQuestionMapper.fromEntityToDTO(result);
    }

    async update(mcqQuestionDTO: McqQuestionDTO, updater?: string): Promise<McqQuestionDTO | undefined> {
        const entity = McqQuestionMapper.fromDTOtoEntity(mcqQuestionDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.mcqQuestionRepository.save(entity);
        return McqQuestionMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.mcqQuestionRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
