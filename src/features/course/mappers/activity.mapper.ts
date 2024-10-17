import { Activity } from '../entities/activity.entity';
import { ActivityDTO } from '../dto/activity.dto';

export class ActivityMapper {
    static fromDTOtoEntity(entityDTO: ActivityDTO): Activity {
        if (!entityDTO) {
            return;
        }
        let entity = new Activity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Activity): ActivityDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new ActivityDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
