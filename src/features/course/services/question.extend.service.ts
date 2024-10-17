import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { QuestionMapper } from '../mappers/question.mapper';
import { Question } from '../entities/question.entity';
import { QuestionRepository } from '../repositories/question.repository';
import { QuestionDTO } from '../dto/question.dto';

const relationshipNames = [];
relationshipNames.push('quizActivity');
relationshipNames.push('mcqQuestion');
relationshipNames.push('mcqQuestion.mcqChoices');
relationshipNames.push('shortAnswerQuestion');
relationshipNames.push('trueOrFalseQuestion');

@Injectable()
export class QuestionService {
    logger = new Logger('QuestionService');
    private questionRepository: QuestionRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.questionRepository = connection.getRepository(Question);
        }
    }

    async findById(id: number): Promise<QuestionDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.questionRepository.findOne(id, options);
        return QuestionMapper.fromEntityToDTO(result);
    }

    async findByQuizId(quizId: number): Promise<any> {
        let result = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.quizActivity', 'quizActivity')
            .leftJoinAndSelect('quizActivity.questions', 'quizQuestions')
            .leftJoinAndSelect('question.trueOrFalseQuestion', 'trueOrFalseQuestion')
            .leftJoinAndSelect('question.shortAnswerQuestion', 'shortAnswerQuestion')
            .leftJoinAndSelect('question.mcqQuestion', 'mcqQuestion')
            .leftJoinAndSelect('mcqQuestion.mcqChoices', 'mcqChoices')
            .where('quizActivity.id = :id', { id: quizId })
            .getMany();
        return result;
    }

    async findByFields(options: FindOneOptions<QuestionDTO>): Promise<QuestionDTO | undefined> {
        const result = await this.questionRepository.findOne(options);
        return QuestionMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<QuestionDTO>): Promise<[QuestionDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.questionRepository.findAndCount(options);
        const questionDTO: QuestionDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(question => questionDTO.push(QuestionMapper.fromEntityToDTO(question)));
            resultList[0] = questionDTO;
        }
        return resultList;
    }

    async save(questionDTO: QuestionDTO, creator?: string): Promise<QuestionDTO | undefined> {
        const entity = QuestionMapper.fromDTOtoEntity(questionDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.questionRepository.save(entity);
        return QuestionMapper.fromEntityToDTO(result);
    }

    async update(questionDTO: QuestionDTO, updater?: string): Promise<QuestionDTO | undefined> {
        const entity = QuestionMapper.fromDTOtoEntity(questionDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.questionRepository.save(entity);
        return QuestionMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.questionRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
