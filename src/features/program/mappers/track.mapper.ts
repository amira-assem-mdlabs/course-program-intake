import { TrackDTO } from '../dto/track.dto';
import { Track } from '../entities/track.entity';

export class TrackMapper {
    static fromDTOtoEntity(entityDTO: TrackDTO): Track {
        if (!entityDTO) {
            return;
        }
        let entity = new Track();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Track): TrackDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new TrackDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
