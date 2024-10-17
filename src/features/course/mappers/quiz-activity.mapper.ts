import { QuizActivityDTO } from '../dto/quiz-activity.dto';
import { QuizActivity } from '../entities/quiz-activity.entity';

export class QuizActivityMapper {
    static fromDTOtoEntity(entityDTO: QuizActivityDTO): QuizActivity {
        if (!entityDTO) {
            return;
        }
        let entity = new QuizActivity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: QuizActivity): QuizActivityDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new QuizActivityDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
