import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject, NotFoundException } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { QuizAttemptMapper } from '../mappers/quiz-attempt.mapper';
import { QuizAttempt } from '../entities/quiz-attempt.entity';
import { QuizAttemptRepository } from '../repositories/quiz-attempt.repository';
import { QuizAttemptDTO } from '../dto/quiz-attempt.dto';
import { ILearner } from '../../../common/interfaces/learner.interface';

const relationshipNames = [];
relationshipNames.push('quiz');
relationshipNames.push('learner');

@Injectable()
export class QuizAttemptService {
    logger = new Logger('QuizAttemptService');
    private quizAttemptRepository: QuizAttemptRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.quizAttemptRepository = connection.getRepository(QuizAttempt);
        }
    }

    async findById(id: number): Promise<QuizAttemptDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.quizAttemptRepository.findOne(id, options);
        return QuizAttemptMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<QuizAttemptDTO>): Promise<QuizAttemptDTO | undefined> {
        const result = await this.quizAttemptRepository.findOne(options);
        return QuizAttemptMapper.fromEntityToDTO(result);
    }

    async findLearnerAttemptsDetails(
        learnerId: number,
        quizId: number,
    ): Promise<{ totalAttempts: number; highestScore: number }> {
        const result = await this.quizAttemptRepository
            .createQueryBuilder('quiz_attempt')
            .leftJoinAndSelect('quiz_attempt.quiz', 'quiz_activity')
            .leftJoinAndSelect('quiz_attempt.learner', 'nhi_user')
            .where('quiz_activity.id = :quizId', { quizId })
            .andWhere('nhi_user.id = :learnerId', { learnerId })
            .select(['COUNT(quiz_attempt.id) as attempts', 'COALESCE(MAX(quiz_attempt.score), 0) as score'])
            .groupBy('quiz_activity.id')
            .addGroupBy('nhi_user.id')
            .getRawOne();

        const totalAttempts = (result && result.attempts && Number(result.attempts)) || 0;
        const highestScore = (result && result.score && Math.round(result.score)) || 0;

        return { totalAttempts, highestScore };
    }

    async findAndCount(options: FindManyOptions<QuizAttemptDTO>): Promise<[QuizAttemptDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.quizAttemptRepository.findAndCount(options);
        const quizAttemptDTO: QuizAttemptDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(quizAttempt => quizAttemptDTO.push(QuizAttemptMapper.fromEntityToDTO(quizAttempt)));
            resultList[0] = quizAttemptDTO;
        }
        return resultList;
    }

    async findLearnerAttempts(quizAttemptDTO: QuizAttemptDTO): Promise<QuizAttemptDTO[]> {
        let result = await this.quizAttemptRepository
            .createQueryBuilder('quiz_attempt')
            .leftJoinAndSelect('quiz_attempt.quiz', 'quiz_activity')
            .leftJoinAndSelect('quiz_attempt.learner', 'nhi_user')
            .where('quiz_activity.id = :quizId', { quizId: quizAttemptDTO.quiz })
            .andWhere('nhi_user.id = :learnerId', { learnerId: quizAttemptDTO.learner.id })
            .getMany();

        return result;
    }

    async save(quizAttemptDTO: QuizAttemptDTO, creator?: string): Promise<QuizAttemptDTO | undefined> {
        const entity = QuizAttemptMapper.fromDTOtoEntity(quizAttemptDTO);
        entity.createdDate = new Date();
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.quizAttemptRepository.save(entity);
        return QuizAttemptMapper.fromEntityToDTO(result);
    }

    async update(quizAttemptDTO: QuizAttemptDTO, updater?: string): Promise<QuizAttemptDTO | undefined> {
        const entity = QuizAttemptMapper.fromDTOtoEntity(quizAttemptDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.quizAttemptRepository.save(entity);
        return QuizAttemptMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.quizAttemptRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async getLearnerQuizMaxScore(learner: ILearner, quizId: number) {
        try {
            const result = await this.quizAttemptRepository
                .createQueryBuilder('quiz_attempt')
                .leftJoinAndSelect('quiz_attempt.quiz', 'quiz')
                .leftJoinAndSelect('quiz_attempt.learner', 'learner')
                .where('quiz.id = :quizId', { quizId })
                .andWhere('learner.id = :learnerId', { learnerId: learner.id })
                .select(['COALESCE(MAX(quiz_attempt.score), 0) as score'])
                .groupBy('quiz.id')
                .addGroupBy('learner.id')
                .getRawOne();
            return result;
        } catch (error) {
            throw new HttpException('Error, learner or quiz not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async deleteLastQuizAttempt(studentId: number, quizId: number): Promise<void> {
        const lastQuizAttempt = await this.quizAttemptRepository
            .createQueryBuilder('quizAttempt')
            .where('quizAttempt.learnerId = :studentId', { studentId })
            .andWhere('quizAttempt.quizId = :quizId', { quizId })
            .orderBy('quizAttempt.id', 'DESC')
            .getOne();

        if (!lastQuizAttempt) {
            throw new NotFoundException(`No quiz attempt found for studentId ${studentId} and quizId ${quizId}`);
        }

        await this.deleteById(lastQuizAttempt.id);
    }
}
