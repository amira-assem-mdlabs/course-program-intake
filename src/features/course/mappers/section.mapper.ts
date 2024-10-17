import { Section } from '../entities/section.entity';
import { SectionDTO } from '../dto/section.dto';

export class SectionMapper {
    static fromDTOtoEntity(entityDTO: SectionDTO): Section {
        if (!entityDTO) {
            throw new Error('Invalid input: entityDTO is undefined or null');
        }

        let entity = new Section();

        return Object.assign(entity, entityDTO);
    }

    static fromEntityToDTO(entity: Section): SectionDTO {
        if (!entity) {
            throw new Error('Invalid input: entity is undefined or null');
        }

        let entityDTO = new SectionDTO();

        return Object.assign(entityDTO, entity);
    }
}
