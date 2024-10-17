import { RelAssignmentLearnerDTO } from '../dto/rel-assignment-learner.dto';
import { RelAssignmentLearner } from '../entities/rel-assignment-learner.entity';

export class RelAssignmentLearnerMapper {
    static fromDTOtoEntity(entityDTO: RelAssignmentLearnerDTO): RelAssignmentLearner {
        if (!entityDTO) {
            return;
        }
        let entity = new RelAssignmentLearner();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelAssignmentLearner): RelAssignmentLearnerDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelAssignmentLearnerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
