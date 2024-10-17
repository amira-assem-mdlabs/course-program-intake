import { VideoActivityDTO } from '../dto/video-activity.dto';
import { VideoActivity } from '../entities/video-activity.entity';

export class VideoActivityMapper {
    static fromDTOtoEntity(entityDTO: VideoActivityDTO): VideoActivity {
        if (!entityDTO) {
            return;
        }
        let entity = new VideoActivity();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: VideoActivity): VideoActivityDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new VideoActivityDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
