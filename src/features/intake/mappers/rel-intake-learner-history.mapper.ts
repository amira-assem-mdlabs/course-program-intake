import { RelIntakeLearnerHistoryDTO } from '../dto/rel-intake-learner-history.dto';
import { RelIntakeLearnerHistory } from '../entities/rel-intake-learner-history.entity';

export class RelIntakeLearnerHistoryMapper {
    static fromDTOtoEntity(entityDTO: RelIntakeLearnerHistoryDTO): RelIntakeLearnerHistory {
        if (!entityDTO) {
            return;
        }
        let entity = new RelIntakeLearnerHistory();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelIntakeLearnerHistory): RelIntakeLearnerHistoryDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelIntakeLearnerHistoryDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
