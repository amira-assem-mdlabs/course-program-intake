import { TrueOrFalseQuestionDTO } from '../dto/true-or-false-question.dto';
import { TrueOrFalseQuestion } from '../entities/true-or-false-question.entity';

export class TrueOrFalseQuestionMapper {
    static fromDTOtoEntity(entityDTO: TrueOrFalseQuestionDTO): TrueOrFalseQuestion {
        if (!entityDTO) {
            return;
        }
        let entity = new TrueOrFalseQuestion();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: TrueOrFalseQuestion): TrueOrFalseQuestionDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new TrueOrFalseQuestionDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
