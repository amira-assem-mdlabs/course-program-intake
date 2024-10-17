import { AudioActivityDTO } from '../dto/audio-activity.dto';
import { AudioActivity } from '../entities/audio-activity.entity';

export class AudioActivityMapper {
    static fromDTOtoEntity(entityDTO: AudioActivityDTO): AudioActivity {
        if (!entityDTO) {
            return;
        }
        let entity = new AudioActivity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: AudioActivity): AudioActivityDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new AudioActivityDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
