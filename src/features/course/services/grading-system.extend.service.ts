// import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
// import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
// import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
// import { GradingSystemMapper } from '../mappers/grading-system.mapper';
// import { GradingSystem } from '../entities/grading-system.entity';
// import { GradingSystemRepository } from '../repositories/grading-system.repository';

// const relationshipNames = [];

// @Injectable()
// export class GradingSystemExtendService {
//     logger = new Logger('GradingSystemExtendService');
//     private gradingSystemRepository: GradingSystemRepository;

//     constructor(@Inject(CONNECTION) connection: Connection) {
//         this.gradingSystemRepository = connection.getRepository(GradingSystem);
//     }

//     async findById(id: number): Promise<GradingSystemDTO | undefined> {
//         const options = { relations: relationshipNames };
//         const result = await this.gradingSystemRepository.findOne(id, options);
//         return GradingSystemMapper.fromEntityToDTO(result);
//     }

//     async findByFields(options: FindOneOptions<GradingSystemDTO>): Promise<GradingSystemDTO | undefined> {
//         const result = await this.gradingSystemRepository.findOne(options);
//         return GradingSystemMapper.fromEntityToDTO(result);
//     }

//     async findAndCount(options: FindManyOptions<GradingSystemDTO>): Promise<[GradingSystemDTO[], number]> {
//         options.relations = relationshipNames;
//         const resultList = await this.gradingSystemRepository.findAndCount(options);
//         const gradingSystemDTO: GradingSystemDTO[] = [];
//         if (resultList && resultList[0]) {
//             resultList[0].forEach(gradingSystem =>
//                 gradingSystemDTO.push(GradingSystemMapper.fromEntityToDTO(gradingSystem)),
//             );
//             resultList[0] = gradingSystemDTO;
//         }
//         return resultList;
//     }

//     async save(gradingSystemDTO: GradingSystemDTO, creator?: string): Promise<GradingSystemDTO | undefined> {
//         const entity = GradingSystemMapper.fromDTOtoEntity(gradingSystemDTO);
//         if (creator) {
//             if (!entity.createdBy) {
//                 entity.createdBy = creator;
//             }
//             entity.lastModifiedBy = creator;
//         }
//         const result = await this.gradingSystemRepository.save(entity);
//         return GradingSystemMapper.fromEntityToDTO(result);
//     }

//     async update(gradingSystemDTO: GradingSystemDTO, updater?: string): Promise<GradingSystemDTO | undefined> {
//         const entity = GradingSystemMapper.fromDTOtoEntity(gradingSystemDTO);
//         if (updater) {
//             entity.lastModifiedBy = updater;
//         }
//         const result = await this.gradingSystemRepository.save(entity);
//         return GradingSystemMapper.fromEntityToDTO(result);
//     }

//     async deleteById(id: number): Promise<void | undefined> {
//         await this.gradingSystemRepository.delete(id);
//         const entityFind = await this.findById(id);
//         if (entityFind) {
//             throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
//         }
//         return;
//     }
// }
