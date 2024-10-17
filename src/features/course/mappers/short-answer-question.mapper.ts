import { ShortAnswerQuestionDTO } from '../dto/short-answer-question.dto';
import { ShortAnswerQuestion } from '../entities/short-answer-question.entity';

export class ShortAnswerQuestionMapper {
    static fromDTOtoEntity(entityDTO: ShortAnswerQuestionDTO): ShortAnswerQuestion {
        if (!entityDTO) {
            return;
        }
        let entity = new ShortAnswerQuestion();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: ShortAnswerQuestion): ShortAnswerQuestionDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new ShortAnswerQuestionDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
