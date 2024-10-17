import { AssignmentActivity } from '../entities/assignment-activity.entity';
import { AssignmentActivityDTO } from '../dto/assignment-activity.dto';

/**
 * A AssignmentActivity mapper object.
 */
export class AssignmentActivityMapper {
    static fromDTOtoEntity(entityDTO: AssignmentActivityDTO): AssignmentActivity {
        if (!entityDTO) {
            return;
        }
        let entity = new AssignmentActivity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: AssignmentActivity): AssignmentActivityDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new AssignmentActivityDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
