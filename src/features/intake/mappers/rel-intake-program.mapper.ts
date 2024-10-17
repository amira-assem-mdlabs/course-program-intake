import { RelIntakeProgramDTO } from '../dto/rel-intake-program.dto';
import { RelIntakeProgram } from '../entities/rel-intake-program.entity';

export class RelIntakeProgramMapper {
    static fromDTOtoEntity(entityDTO: RelIntakeProgramDTO): RelIntakeProgram {
        if (!entityDTO) {
            return;
        }
        let entity = new RelIntakeProgram();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelIntakeProgram): RelIntakeProgramDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelIntakeProgramDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
