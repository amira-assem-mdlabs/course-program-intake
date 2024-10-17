import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';

import { RelIntakeProgramRepository } from '../repositories/rel-intake-program.repository';
import { Program } from '../../program/entities/program.entity';
import { RelIntakeProgramDTO } from '../dto/rel-intake-program.dto';
import { RelIntakeProgram } from '../entities/rel-intake-program.entity';
import { RelIntakeProgramMapper } from '../mappers/rel-intake-program.mapper';

const relationshipNames = [];
relationshipNames.push('program');
relationshipNames.push('intake');

@Injectable()
export class RelIntakeProgramService {
    logger = new Logger('RelIntakeProgramService');
    private relIntakeProgramRepository: RelIntakeProgramRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relIntakeProgramRepository = connection.getRepository(RelIntakeProgram);
        }
    }

    async findById(id: number): Promise<RelIntakeProgramDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relIntakeProgramRepository.findOne(id, options);
        return RelIntakeProgramMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelIntakeProgramDTO>): Promise<RelIntakeProgramDTO | undefined> {
        const result = await this.relIntakeProgramRepository.findOne(options);
        return RelIntakeProgramMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelIntakeProgramDTO>): Promise<[RelIntakeProgramDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.relIntakeProgramRepository.findAndCount(options);
        const relIntakeProgramDTO: RelIntakeProgramDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(relIntakeProgram =>
                relIntakeProgramDTO.push(RelIntakeProgramMapper.fromEntityToDTO(relIntakeProgram)),
            );
            resultList[0] = relIntakeProgramDTO;
        }
        return resultList;
    }

    async findAllIntakePrograms(program: Program): Promise<RelIntakeProgram[]> {
        return await this.relIntakeProgramRepository
            .createQueryBuilder('relIntakeProgram')
            .leftJoin('relIntakeProgram.program', 'program')
            .leftJoinAndSelect('relIntakeProgram.intake', 'intake')
            .where('program.id = :id', { id: program.id })
            .orderBy('intake.learningStartDate', 'ASC')
            .getMany();
    }

    async findAndCountOngoingIntakes(programId: number): Promise<[RelIntakeProgramDTO[], number]> {
        const today = new Date().toISOString().split('T')[0];

        return await this.relIntakeProgramRepository
            .createQueryBuilder('relIntakeProgram')
            .leftJoinAndSelect('relIntakeProgram.program', 'program')
            .where('program.id = :id', { id: programId })
            .leftJoinAndSelect('relIntakeProgram.intake', 'intake')
            .andWhere('intake.learningEndDate > :today', { today })
            .getManyAndCount();
    }

    async save(relIntakeProgramDTO: RelIntakeProgramDTO, creator?: string): Promise<RelIntakeProgramDTO | undefined> {
        const entity = RelIntakeProgramMapper.fromDTOtoEntity(relIntakeProgramDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.relIntakeProgramRepository.save(entity);
        return RelIntakeProgramMapper.fromEntityToDTO(result);
    }

    async update(relIntakeProgramDTO: RelIntakeProgramDTO, updater?: string): Promise<RelIntakeProgramDTO | undefined> {
        const entity = RelIntakeProgramMapper.fromDTOtoEntity(relIntakeProgramDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.relIntakeProgramRepository.save(entity);
        return RelIntakeProgramMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relIntakeProgramRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async findAllIntakesForEntity(entityId: number): Promise<[RelIntakeProgramDTO[], number]> {
        return await this.relIntakeProgramRepository
            .createQueryBuilder('relIntakeProgram')
            .innerJoin('relIntakeProgram.program', 'program')
            .innerJoin('relIntakeProgram.intake', 'intake')
            .where('program.id = :id', { id: entityId })
            .orderBy('intake.learningStartDate', 'ASC')
            .getManyAndCount();
    }
}
