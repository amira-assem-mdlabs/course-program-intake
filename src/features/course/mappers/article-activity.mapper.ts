import { ArticleActivity } from '../entities/article-activity.entity';
import { ArticleActivityDTO } from '../dto/article-activity.dto';

export class ArticleActivityMapper {
    static fromDTOtoEntity(entityDTO: ArticleActivityDTO): ArticleActivity {
        if (!entityDTO) {
            return;
        }
        let entity = new ArticleActivity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: ArticleActivity): ArticleActivityDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new ArticleActivityDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
