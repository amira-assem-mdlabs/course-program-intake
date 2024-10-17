import { AssignmentFileDTO } from '../dto/assignment-file.dto';
import { AssignmentFile } from '../entities/assignment-file.entity';

export class AssignmentFileMapper {
    static fromDTOtoEntity(entityDTO: AssignmentFileDTO): AssignmentFile {
        if (!entityDTO) {
            return;
        }
        let entity = new AssignmentFile();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: AssignmentFile): AssignmentFileDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new AssignmentFileDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
