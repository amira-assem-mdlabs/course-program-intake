import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { RelAssignmentLearnerMapper } from '../mappers/rel-assignment-learner.mapper';
import { Activity } from '../entities/activity.entity';
import { PageRequest } from '../../../common/entities/pagination.entity';
import { RelAssignmentLearner } from '../entities/rel-assignment-learner.entity';
import { ActivityRepository } from '../repositories/activity.repository';
import { ActivityDTO } from '../dto/activity.dto';
import { RelAssignmentLearnerDTO } from '../dto/rel-assignment-learner.dto';
import { RelAssignmentLearnerRepository } from '../repositories/rel-assignment-learner.repository';
import { ILearner } from '../../../common/interfaces/learner.interface';
import { RelAssignmentLearnerExtendDTO } from '../dto/rel-assignment-learner.extend.dto';
import { RoleType } from '../../../common/enumeration/role-type';

const relationshipNames = [];
relationshipNames.push('assignment');
relationshipNames.push('learner');

@Injectable()
export class RelAssignmentLearnerService {
    logger = new Logger('RelAssignmentLearnerService');
    private relAssignmentLearnerRepository: RelAssignmentLearnerRepository;
    private activityRepository: ActivityRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relAssignmentLearnerRepository = connection.getRepository(RelAssignmentLearner);
            this.activityRepository = connection.getRepository(Activity);
        }
    }

    async findById(id: number): Promise<RelAssignmentLearnerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relAssignmentLearnerRepository.findOne(id, options);
        return RelAssignmentLearnerMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelAssignmentLearnerDTO>): Promise<RelAssignmentLearnerDTO | undefined> {
        const result = await this.relAssignmentLearnerRepository.findOne(options);
        return RelAssignmentLearnerMapper.fromEntityToDTO(result);
    }

    async findAndCount(
        options: FindManyOptions<RelAssignmentLearnerDTO>,
    ): Promise<[RelAssignmentLearnerDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.relAssignmentLearnerRepository.findAndCount(options);
        const relAssignmentLearnerDTO: RelAssignmentLearnerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(relAssignmentLearner =>
                relAssignmentLearnerDTO.push(RelAssignmentLearnerMapper.fromEntityToDTO(relAssignmentLearner)),
            );
            resultList[0] = relAssignmentLearnerDTO;
        }
        return resultList;
    }

    async save(
        relAssignmentLearnerDTO: RelAssignmentLearnerDTO,
        creator?: string,
    ): Promise<RelAssignmentLearnerDTO | undefined> {
        const entity = RelAssignmentLearnerMapper.fromDTOtoEntity(relAssignmentLearnerDTO);

        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relAssignmentLearnerRepository.save(entity);
        return RelAssignmentLearnerMapper.fromEntityToDTO(result);
    }

    async update(
        relAssignmentLearnerDTO: RelAssignmentLearnerDTO,
        updater?: string,
    ): Promise<RelAssignmentLearnerDTO | undefined> {
        const entity = RelAssignmentLearnerMapper.fromDTOtoEntity(relAssignmentLearnerDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relAssignmentLearnerRepository.save(entity);
        return RelAssignmentLearnerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relAssignmentLearnerRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async getDetailsById(id: number): Promise<ActivityDTO> {
        try {
            const result = await this.activityRepository
                .createQueryBuilder('activity')
                .leftJoinAndSelect('activity.lesson', 'lesson')
                .leftJoinAndSelect('lesson.section', 'section')
                .leftJoinAndSelect('section.course', 'course')
                .leftJoinAndSelect('course.users', 'nhi_user')
                .leftJoinAndSelect('activity.assignmentActivity', 'assignmentActivity')
                .leftJoinAndSelect('assignmentActivity.relAssignmentLearners', 'relAssignmentLearner')
                .leftJoinAndSelect('relAssignmentLearner.learner', 'learner')
                .leftJoinAndSelect('relAssignmentLearner.assignment', 'assignment')
                .leftJoinAndSelect('relAssignmentLearner.relAssignmentFileLearners', 'relAssignmentFileLearners')
                .where('relAssignmentLearner.id = :id', { id })
                .getOne();

            return result;
        } catch (error) {
            console.log('error', error);
            throw new HttpException('relAssignmentLearner not found!', HttpStatus.BAD_REQUEST);
        }
    }

    async findByFieldsV2(
        pageRequest: PageRequest,
        options: {
            searchKeyword?: string;
            searchCategory?: 'ALL' | 'STUDENTS' | 'ASSIGNMENTS';
            submissionPeriodStart?: string;
            submissionPeriodEnd?: string;
            isSubmitted?: boolean;
        },
        user: ILearner,
    ): Promise<[RelAssignmentLearnerExtendDTO[], number]> {
        try {
            const isLecturer = user.authorities.includes(RoleType.LECTURER);
            const isLearner = user.authorities.includes(RoleType.LEARNER);
            let query = this.relAssignmentLearnerRepository
                .createQueryBuilder('relAssignmentLearner')
                .leftJoinAndSelect('relAssignmentLearner.learner', 'learner')
                .leftJoinAndSelect('relAssignmentLearner.assignment', 'assignment')
                .leftJoinAndSelect('assignment.activity', 'activity')
                .leftJoinAndSelect('activity.lesson', 'lesson')
                .leftJoinAndSelect('lesson.section', 'section')
                .leftJoinAndSelect('section.course', 'course')
                .where('activity.id IS NOT NULL');

            if (options.searchKeyword && options.searchCategory) {
                switch (options.searchCategory) {
                    case 'STUDENTS':
                        query.where('learner.firstName ILIKE :name', { name: `%${options.searchKeyword}%` });
                        break;
                    case 'ASSIGNMENTS':
                        query.where('assignment.title ILIKE :name', { name: `%${options.searchKeyword}%` });
                        break;
                    case 'ALL':
                        query.where('(assignment.title ILIKE :name OR learner.firstName ILIKE :name)', {
                            name: `%${options.searchKeyword}%`,
                        });
                        break;
                    default:
                        break;
                }
            }

            if (options.isSubmitted) {
                query.andWhere('relAssignmentLearner.isSubmitted = :isSubmitted', { isSubmitted: true });
            }

            if (options.submissionPeriodStart && options.submissionPeriodEnd) {
                query.andWhere('relAssignmentLearner.submissionDate BETWEEN :start AND :end', {
                    start: options.submissionPeriodStart,
                    end: options.submissionPeriodEnd,
                });
            }

            if (isLecturer) {
                query.leftJoin('course.users', 'nhi_user').andWhere('nhi_user.id = :id', { id: user.id });
            }

            if (isLearner) {
                query.andWhere('learner.id = :learnerId', { learnerId: user.id });
            }

            const count = await query.getCount();

            const relLearnerAssignments = await query
                .orderBy(
                    `relAssignmentLearner.${pageRequest.sort.property}`,
                    pageRequest.sort.direction === 'DESC' ? 'DESC' : 'ASC',
                )
                .take(pageRequest.size)
                .skip(pageRequest.size * pageRequest.page)
                .getMany();

            return [relLearnerAssignments, count];
        } catch (error) {
            console.log('error', error);
            throw new HttpException('relAssignmentLearner not found!', HttpStatus.BAD_REQUEST);
        }
    }
}
