import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { CategoryMapper } from '../mappers/category.mapper';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryDTO } from '../dto/category.dto';

const relationshipNames = [];
relationshipNames.push('parent');

@Injectable()
export class CategoryService {
    logger = new Logger('CategoryService');

    private categoryRepository: CategoryRepository;
    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.categoryRepository = connection.getRepository(Category);
        }
    }

    async findById(id: number): Promise<CategoryDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.categoryRepository.findOne(id, options);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<CategoryDTO>): Promise<CategoryDTO | undefined> {
        const result = await this.categoryRepository.findOne(options);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async findSubCategory(parent: CategoryDTO): Promise<CategoryDTO[]> {
        const resultList = await this.categoryRepository.find({ where: { parent: parent } });
        return resultList;
    }

    async findAndCount(options: FindManyOptions<CategoryDTO>): Promise<[CategoryDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.categoryRepository.findAndCount(options);
        const categoryDTO: CategoryDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(category => categoryDTO.push(CategoryMapper.fromEntityToDTO(category)));
            resultList[0] = categoryDTO;
        }
        return resultList;
    }

    async save(categoryDTO: CategoryDTO, creator?: string): Promise<CategoryDTO | undefined> {
        const entity = CategoryMapper.fromDTOtoEntity(categoryDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.categoryRepository.save(entity);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async update(categoryDTO: CategoryDTO, updater?: string): Promise<CategoryDTO | undefined> {
        const entity = CategoryMapper.fromDTOtoEntity(categoryDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.categoryRepository.save(entity);
        return CategoryMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.categoryRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
