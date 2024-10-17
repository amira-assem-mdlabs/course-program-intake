import { RelIntakeTrackDTO } from '../dto/rel-intake-track.dto';
import { RelIntakeTrack } from '../entities/rel-intake-track.entity';

export class RelIntakeTrackMapper {
    static fromDTOtoEntity(entityDTO: RelIntakeTrackDTO): RelIntakeTrack {
        if (!entityDTO) {
            return;
        }
        let entity = new RelIntakeTrack();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelIntakeTrack): RelIntakeTrackDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelIntakeTrackDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
