import { RelLessonLearnerDTO } from '../dto/rel-lesson-learner.dto';
import { RelLessonLearner } from '../entities/rel-lesson-learner.entity';

export class RelLessonLearnerMapper {
    static fromDTOtoEntity(entityDTO: RelLessonLearnerDTO): RelLessonLearner {
        if (!entityDTO) {
            return;
        }
        let entity = new RelLessonLearner();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelLessonLearner): RelLessonLearnerDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelLessonLearnerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
