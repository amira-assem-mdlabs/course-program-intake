import { KeywordDTO } from '../dto/keyword.dto';
import { Keyword } from '../entities/keyword.entity';

export class KeywordMapper {
    static fromDTOtoEntity(entityDTO: KeywordDTO): Keyword {
        if (!entityDTO) {
            return;
        }
        let entity = new Keyword();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Keyword): KeywordDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new KeywordDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
