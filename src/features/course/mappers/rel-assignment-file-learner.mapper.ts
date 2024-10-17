import { RelAssignmentFileLearnerDTO } from '../dto/rel-assignment-file-learner.dto';
import { RelAssignmentFileLearner } from '../entities/rel-assignment-file-learner.entity';

export class RelAssignmentFileLearnerMapper {
    static fromDTOtoEntity(entityDTO: RelAssignmentFileLearnerDTO): RelAssignmentFileLearner {
        if (!entityDTO) {
            return;
        }
        let entity = new RelAssignmentFileLearner();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelAssignmentFileLearner): RelAssignmentFileLearnerDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelAssignmentFileLearnerDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
