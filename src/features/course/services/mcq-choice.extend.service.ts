import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { McqChoiceMapper } from '../mappers/mcq-choice.mapper';
import { McqChoice } from '../entities/mcq-choice.entity';
import { McqChoiceRepository } from '../repositories/mcq-choice.repository';
import { McqChoiceDTO } from '../dto/mcq-choice.dto';

const relationshipNames = [];
relationshipNames.push('mcqQuestion');

@Injectable()
export class McqChoiceService {
    logger = new Logger('McqChoiceService');
    private mcqChoiceRepository: McqChoiceRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.mcqChoiceRepository = connection.getRepository(McqChoice);
        }
    }

    async findById(id: number): Promise<McqChoiceDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.mcqChoiceRepository.findOne(id, options);
        return McqChoiceMapper.fromEntityToDTO(result);
    }

    async addMany(choices: McqChoiceDTO[], creator?: string): Promise<any> {
        let results = await this.mcqChoiceRepository
            .createQueryBuilder()
            .insert()
            .values([...choices])
            .execute();
        return results.identifiers;
    }
    async findByFields(options: FindOneOptions<McqChoiceDTO>): Promise<McqChoiceDTO | undefined> {
        const result = await this.mcqChoiceRepository.findOne(options);
        return McqChoiceMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<McqChoiceDTO>): Promise<[McqChoiceDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.mcqChoiceRepository.findAndCount(options);
        const mcqChoiceDTO: McqChoiceDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(mcqChoice => mcqChoiceDTO.push(McqChoiceMapper.fromEntityToDTO(mcqChoice)));
            resultList[0] = mcqChoiceDTO;
        }
        return resultList;
    }

    async save(mcqChoiceDTO: McqChoiceDTO, creator?: string): Promise<McqChoiceDTO | undefined> {
        const entity = McqChoiceMapper.fromDTOtoEntity(mcqChoiceDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.mcqChoiceRepository.save(entity);
        return McqChoiceMapper.fromEntityToDTO(result);
    }

    async update(mcqChoiceDTO: McqChoiceDTO, updater?: string): Promise<McqChoiceDTO | undefined> {
        const entity = McqChoiceMapper.fromDTOtoEntity(mcqChoiceDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.mcqChoiceRepository.save(entity);
        return McqChoiceMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.mcqChoiceRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
