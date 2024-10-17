import { McqQuestionDTO } from '../dto/mcq-question.dto';
import { McqQuestion } from '../entities/mcq-question.entity';

export class McqQuestionMapper {
    static fromDTOtoEntity(entityDTO: McqQuestionDTO): McqQuestion {
        if (!entityDTO) {
            return;
        }
        let entity = new McqQuestion();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: McqQuestion): McqQuestionDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new McqQuestionDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
