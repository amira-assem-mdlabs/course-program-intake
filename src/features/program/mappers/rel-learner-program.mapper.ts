import { RelLearnerProgramDTO } from '../dto/rel-learner-program.dto';
import { RelLearnerProgram } from '../entities/rel-learner-program.entity';

export class RelLearnerProgramMapper {
    static fromDTOtoEntity(entityDTO: RelLearnerProgramDTO): RelLearnerProgram {
        if (!entityDTO) {
            return;
        }
        let entity = new RelLearnerProgram();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelLearnerProgram): RelLearnerProgramDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelLearnerProgramDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
