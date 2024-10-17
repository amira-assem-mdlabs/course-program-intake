import { QuizAnswerDTO } from '../dto/quiz-answer.dto';
import { QuizAnswer } from '../entities/quiz-answer.entity';

export class QuizAnswerMapper {
    static fromDTOtoEntity(entityDTO: QuizAnswerDTO): QuizAnswer {
        if (!entityDTO) {
            return;
        }
        let entity = new QuizAnswer();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: QuizAnswer): QuizAnswerDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new QuizAnswerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
