import { ProgramDTO } from '../dto/program.dto';
import { Program } from '../entities/program.entity';

export class ProgramMapper {
    static fromDTOtoEntity(entityDTO: ProgramDTO): Program {
        if (!entityDTO) {
            return;
        }
        let entity = new Program();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Program): ProgramDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new ProgramDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
