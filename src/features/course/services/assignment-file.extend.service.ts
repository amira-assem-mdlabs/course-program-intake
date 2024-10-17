import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';

import { AssignmentFileMapper } from '../mappers/assignment-file.mapper';
import { AssignmentFile } from '../entities/assignment-file.entity';
import { AssignmentFileRepository } from '../repositories/assignment-file.repository';
import { AssignmentFileDTO } from '../dto/assignment-file.dto';

const relationshipNames = [];
relationshipNames.push('assignment');

@Injectable()
export class AssignmentFileService {
    logger = new Logger('AssignemntFileExtendService');
    private assignmentFileRepository: AssignmentFileRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.assignmentFileRepository = connection.getRepository(AssignmentFile);
        }
    }

    async findById(id: number): Promise<AssignmentFileDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.assignmentFileRepository.findOne(id, options);
        return AssignmentFileMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AssignmentFileDTO>): Promise<AssignmentFileDTO | undefined> {
        const result = await this.assignmentFileRepository.findOne(options);
        return AssignmentFileMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AssignmentFileDTO>): Promise<[AssignmentFileDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.assignmentFileRepository.findAndCount(options);
        const assignmentFileDTO: AssignmentFileDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(assignmentFile =>
                assignmentFileDTO.push(AssignmentFileMapper.fromEntityToDTO(assignmentFile)),
            );
            resultList[0] = assignmentFileDTO;
        }
        return resultList;
    }

    async save(assignmentFileDTO: AssignmentFileDTO, creator?: string): Promise<AssignmentFileDTO | undefined> {
        const entity = AssignmentFileMapper.fromDTOtoEntity(assignmentFileDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.assignmentFileRepository.save(entity);
        return AssignmentFileMapper.fromEntityToDTO(result);
    }

    async update(assignmentFileDTO: AssignmentFileDTO, updater?: string): Promise<AssignmentFileDTO | undefined> {
        const entity = AssignmentFileMapper.fromDTOtoEntity(assignmentFileDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.assignmentFileRepository.save(entity);
        return AssignmentFileMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.assignmentFileRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
