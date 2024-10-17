import { UserCompletedTrackDTO } from '../dto/user-completed-track.dto';
import { UserCompletedTrack } from '../entities/user-completed-track.entity';

export class UserCompletedTrackMapper {
    static fromDTOtoEntity(entityDTO: UserCompletedTrackDTO): UserCompletedTrack {
        if (!entityDTO) {
            return;
        }
        let entity = new UserCompletedTrack();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: UserCompletedTrack): UserCompletedTrackDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new UserCompletedTrackDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
