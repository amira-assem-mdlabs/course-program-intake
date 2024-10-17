import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { AssignmentActivityMapper } from '../mappers/assignment-activity.mapper';
import { AssignmentActivity } from '../entities/assignment-activity.entity';
import { AssignmentActivityRepository } from '../repositories/assignment-activity.repository';
import { AssignmentActivityDTO } from '../dto/assignment-activity.dto';

const relationshipNames = [];

@Injectable()
export class AssignmentActivityService {
    logger = new Logger('AssignmentActivityService');
    private assignmentActivityRepository: AssignmentActivityRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.assignmentActivityRepository = connection.getRepository(AssignmentActivity);
        }
    }

    async findById(id: number): Promise<AssignmentActivityDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.assignmentActivityRepository.findOne(id, options);
        return AssignmentActivityMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AssignmentActivityDTO>): Promise<AssignmentActivityDTO | undefined> {
        const result = await this.assignmentActivityRepository.findOne(options);
        return AssignmentActivityMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AssignmentActivityDTO>): Promise<[AssignmentActivityDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.assignmentActivityRepository.findAndCount(options);
        const assignmentActivityDTO: AssignmentActivityDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(assignmentActivity =>
                assignmentActivityDTO.push(AssignmentActivityMapper.fromEntityToDTO(assignmentActivity)),
            );
            resultList[0] = assignmentActivityDTO;
        }
        return resultList;
    }

    async save(
        assignmentActivityDTO: AssignmentActivityDTO,
        creator?: string,
    ): Promise<AssignmentActivityDTO | undefined> {
        const entity = AssignmentActivityMapper.fromDTOtoEntity(assignmentActivityDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.assignmentActivityRepository.save(entity);
        return AssignmentActivityMapper.fromEntityToDTO(result);
    }

    async update(
        assignmentActivityDTO: AssignmentActivityDTO,
        updater?: string,
    ): Promise<AssignmentActivityDTO | undefined> {
        const entity = AssignmentActivityMapper.fromDTOtoEntity(assignmentActivityDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.assignmentActivityRepository.save(entity);
        return AssignmentActivityMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.assignmentActivityRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
