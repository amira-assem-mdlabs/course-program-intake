import { RelIntakeCourseDTO } from '../dto/rel-intake-course.dto';
import { RelIntakeCourse } from '../entities/rel-intake-course.entity';

export class RelIntakeCourseMapper {
    static fromDTOtoEntity(entityDTO: RelIntakeCourseDTO): RelIntakeCourse {
        if (!entityDTO) {
            return;
        }
        let entity = new RelIntakeCourse();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: RelIntakeCourse): RelIntakeCourseDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new RelIntakeCourseDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
