import { IntakeStudyPlanDTO } from '../dto/intake-study-plan.dto';
import { IntakeStudyPlan } from '../entities/intake-study-plan.entity';

export class IntakeStudyPlanMapper {
    static fromDTOtoEntity(entityDTO: IntakeStudyPlanDTO): IntakeStudyPlan {
        if (!entityDTO) {
            return;
        }
        let entity = new IntakeStudyPlan();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: IntakeStudyPlan): IntakeStudyPlanDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new IntakeStudyPlanDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
