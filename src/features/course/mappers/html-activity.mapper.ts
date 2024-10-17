import { HtmlActivityDTO } from '../dto/html-activity.dto';
import { HtmlActivity } from '../entities/html-activity.entity';

export class HtmlActivityMapper {
    static fromDTOtoEntity(entityDTO: HtmlActivityDTO): HtmlActivity {
        if (!entityDTO) {
            return;
        }
        let entity = new HtmlActivity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: HtmlActivity): HtmlActivityDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new HtmlActivityDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
