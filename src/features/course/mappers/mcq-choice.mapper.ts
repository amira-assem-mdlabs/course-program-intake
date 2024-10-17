import { McqChoiceDTO } from '../dto/mcq-choice.dto';
import { McqChoice } from '../entities/mcq-choice.entity';

export class McqChoiceMapper {
    static fromDTOtoEntity(entityDTO: McqChoiceDTO): McqChoice {
        if (!entityDTO) {
            return;
        }
        let entity = new McqChoice();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: McqChoice): McqChoiceDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new McqChoiceDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
