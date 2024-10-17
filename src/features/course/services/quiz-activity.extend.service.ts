import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { QuizActivityMapper } from '../mappers/quiz-activity.mapper';
import { QuizActivity } from '../entities/quiz-activity.entity';
import { QuizActivityRepository } from '../repositories/quiz-activity.repository';
import { QuizActivityDTO } from '../dto/quiz-activity.dto';

const relationshipNames = [];

@Injectable()
export class QuizActivityService {
    logger = new Logger('QuizActivityService');

    private quizActivityRepository: QuizActivityRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.quizActivityRepository = connection.getRepository(QuizActivity);
        }
    }

    async findById(id: number): Promise<QuizActivityDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.quizActivityRepository.findOne(id, options);
        return QuizActivityMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<QuizActivityDTO>): Promise<QuizActivityDTO | undefined> {
        const result = await this.quizActivityRepository.findOne(options);
        return QuizActivityMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<QuizActivityDTO>): Promise<[QuizActivityDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.quizActivityRepository.findAndCount(options);
        const quizActivityDTO: QuizActivityDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(quizActivity =>
                quizActivityDTO.push(QuizActivityMapper.fromEntityToDTO(quizActivity)),
            );
            resultList[0] = quizActivityDTO;
        }
        return resultList;
    }

    async save(quizActivityDTO: QuizActivityDTO, creator?: string): Promise<QuizActivityDTO | undefined> {
        const entity = QuizActivityMapper.fromDTOtoEntity(quizActivityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.quizActivityRepository.save(entity);
        return QuizActivityMapper.fromEntityToDTO(result);
    }

    async update(quizActivityDTO: QuizActivityDTO, updater?: string): Promise<QuizActivityDTO | undefined> {
        const entity = QuizActivityMapper.fromDTOtoEntity(quizActivityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.quizActivityRepository.save(entity);
        return QuizActivityMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.quizActivityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
