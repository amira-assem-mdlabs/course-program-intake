import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { RelAssignmentFileLearnerMapper } from '../mappers/rel-assignment-file-learner.mapper';
import { RelAssignmentFileLearner } from '../entities/rel-assignment-file-learner.entity';
import { RelAssignmentFileLearnerRepository } from '../repositories/rel-assignment-file-learner.repository';
import { RelAssignmentFileLearnerDTO } from '../dto/rel-assignment-file-learner.dto';

const relationshipNames = [];
relationshipNames.push('learnerAssignment');

@Injectable()
export class RelAssignmentFileLearnerService {
    logger = new Logger('RelAssignmentFileLearnerService');
    private relAssignmentFileLearnerRepository: RelAssignmentFileLearnerRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relAssignmentFileLearnerRepository = connection.getRepository(RelAssignmentFileLearner);
        }
    }

    async findById(id: number): Promise<RelAssignmentFileLearnerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relAssignmentFileLearnerRepository.findOne(id, options);
        return RelAssignmentFileLearnerMapper.fromEntityToDTO(result);
    }

    async findByFields(
        options: FindOneOptions<RelAssignmentFileLearnerDTO>,
    ): Promise<RelAssignmentFileLearnerDTO | undefined> {
        const result = await this.relAssignmentFileLearnerRepository.findOne(options);
        return RelAssignmentFileLearnerMapper.fromEntityToDTO(result);
    }

    async findAndCount(
        options: FindManyOptions<RelAssignmentFileLearnerDTO>,
    ): Promise<[RelAssignmentFileLearnerDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.relAssignmentFileLearnerRepository.findAndCount(options);
        const relAssignmentFileLearnerDTO: RelAssignmentFileLearnerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(relAssignmentFileLearner =>
                relAssignmentFileLearnerDTO.push(
                    RelAssignmentFileLearnerMapper.fromEntityToDTO(relAssignmentFileLearner),
                ),
            );
            resultList[0] = relAssignmentFileLearnerDTO;
        }
        return resultList;
    }

    async save(
        relAssignmentFileLearnerDTO: RelAssignmentFileLearnerDTO,
        creator?: string,
    ): Promise<RelAssignmentFileLearnerDTO | undefined> {
        const entity = RelAssignmentFileLearnerMapper.fromDTOtoEntity(relAssignmentFileLearnerDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relAssignmentFileLearnerRepository.save(entity);
        return RelAssignmentFileLearnerMapper.fromEntityToDTO(result);
    }

    async update(
        relAssignmentFileLearnerDTO: RelAssignmentFileLearnerDTO,
        updater?: string,
    ): Promise<RelAssignmentFileLearnerDTO | undefined> {
        const entity = RelAssignmentFileLearnerMapper.fromDTOtoEntity(relAssignmentFileLearnerDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relAssignmentFileLearnerRepository.save(entity);
        return RelAssignmentFileLearnerMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relAssignmentFileLearnerRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
