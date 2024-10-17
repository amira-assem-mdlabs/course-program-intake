import { RelIntakeLearnerDTO } from '../dto/rel-intake-learner.dto';
import { RelIntakeLearner } from '../entities/rel-intake-learner.entity';

export class RelIntakeLearnerMapper {
    static fromDTOtoEntity(entityDTO: RelIntakeLearnerDTO): RelIntakeLearner {
        if (!entityDTO) {
            return;
        }
        let entity = new RelIntakeLearner();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelIntakeLearner): RelIntakeLearnerDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelIntakeLearnerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
