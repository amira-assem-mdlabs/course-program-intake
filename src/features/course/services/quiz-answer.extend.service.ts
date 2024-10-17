import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { QuizAnswerMapper } from '../mappers/quiz-answer.mapper';
import { QuizAnswer } from '../entities/quiz-answer.entity';
import { QuizAnswerRepository } from '../repositories/quiz-answer.repository';
import { QuizAnswerDTO } from '../dto/quiz-answer.dto';

const relationshipNames = [];
relationshipNames.push('question');
relationshipNames.push('attempt');

@Injectable()
export class QuizAnswerService {
    logger = new Logger('QuizAnswerService');
    private quizAnswerRepository: QuizAnswerRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.quizAnswerRepository = connection.getRepository(QuizAnswer);
        }
    }

    async findById(id: number): Promise<QuizAnswerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.quizAnswerRepository.findOne(id, options);
        return QuizAnswerMapper.fromEntityToDTO(result);
    }
    async getScore(attempId: number): Promise<any> {
        const answers = await this.quizAnswerRepository
            .createQueryBuilder('quiz_answer')
            .leftJoinAndSelect('quiz_answer.attempt', 'quiz_attempt')
            .where('quiz_attempt.id = :id', { id: attempId })
            .getMany();

        const result = answers.filter(answer => answer.isRight === true);
        return (result.length / answers.length) * 100;
    }

    async findByFields(options: FindOneOptions<QuizAnswerDTO>): Promise<QuizAnswerDTO | undefined> {
        const result = await this.quizAnswerRepository.findOne(options);
        return QuizAnswerMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<QuizAnswerDTO>): Promise<[QuizAnswerDTO[], number]> {
        if (!options.relations) {
            options.relations = relationshipNames;
        }
        const resultList = await this.quizAnswerRepository.findAndCount(options);
        const quizAnswerDTO: QuizAnswerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(quizAnswer => quizAnswerDTO.push(QuizAnswerMapper.fromEntityToDTO(quizAnswer)));
            resultList[0] = quizAnswerDTO;
        }
        return resultList;
    }

    async findAllAnswerDetails(attemptId: number): Promise<QuizAnswerDTO[]> {
        const resultList = await this.quizAnswerRepository
            .createQueryBuilder('quiz_answer')
            .where('quiz_answer.attempt = :attemptId', { attemptId })
            .leftJoinAndSelect('quiz_answer.attempt', 'quiz_attempt')
            .leftJoinAndSelect('quiz_answer.question', 'question')
            .leftJoinAndSelect('question.mcqQuestion', 'mcq_question')
            .leftJoinAndSelect('question.shortAnswerQuestion', 'short_answer_question')
            .leftJoinAndSelect('question.trueOrFalseQuestion', 'true_or_false_question')
            .leftJoinAndSelect('mcq_question.mcqChoices', 'mcq_choices')
            .addOrderBy('question.id', 'ASC')
            .getMany();

        return resultList;
    }

    async save(quizAnswerDTO: QuizAnswerDTO, creator?: string): Promise<QuizAnswerDTO | undefined> {
        const entity = QuizAnswerMapper.fromDTOtoEntity(quizAnswerDTO);
        entity.createdDate = new Date();
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.quizAnswerRepository.save(entity);
        return QuizAnswerMapper.fromEntityToDTO(result);
    }

    async update(quizAnswerDTO: QuizAnswerDTO, updater?: string): Promise<QuizAnswerDTO | undefined> {
        const entity = QuizAnswerMapper.fromDTOtoEntity(quizAnswerDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.quizAnswerRepository.save(entity);
        return QuizAnswerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.quizAnswerRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
