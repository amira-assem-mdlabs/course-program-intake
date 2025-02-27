import { CategoryDTO } from '../dto/category.dto';
import { Category } from '../entities/category.entity';

export class CategoryMapper {
    static fromDTOtoEntity(entityDTO: CategoryDTO): Category {
        if (!entityDTO) {
            return;
        }
        let entity = new Category();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Category): CategoryDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new CategoryDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
