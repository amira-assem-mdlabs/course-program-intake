import { IntakeDTO } from '../dto/intake.dto';
import { Intake } from '../entities/intake.entity';

export class IntakeMapper {
    static fromDTOtoEntity(entityDTO: IntakeDTO): Intake {
        if (!entityDTO) {
            return;
        }
        let entity = new Intake();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Intake): IntakeDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new IntakeDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
