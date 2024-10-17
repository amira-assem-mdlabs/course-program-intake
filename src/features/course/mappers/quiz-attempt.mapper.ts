import { QuizAttemptDTO } from '../dto/quiz-attempt.dto';
import { QuizAttempt } from '../entities/quiz-attempt.entity';

export class QuizAttemptMapper {
    static fromDTOtoEntity(entityDTO: QuizAttemptDTO): QuizAttempt {
        if (!entityDTO) {
            return;
        }
        let entity = new QuizAttempt();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: QuizAttempt): QuizAttemptDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new QuizAttemptDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
