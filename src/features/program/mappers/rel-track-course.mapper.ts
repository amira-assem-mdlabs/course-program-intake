import { RelTrackCourseDTO } from '../dto/rel-track-course.dto';
import { RelTrackCourse } from '../entities/rel-track-course.entity';

export class RelTrackCourseMapper {
    static fromDTOtoEntity(entityDTO: RelTrackCourseDTO): RelTrackCourse {
        if (!entityDTO) {
            return;
        }
        let entity = new RelTrackCourse();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelTrackCourse): RelTrackCourseDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelTrackCourseDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
