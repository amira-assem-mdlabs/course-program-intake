import { Course } from '../entities/course.entity';
import { CourseDTO } from '../dto/course.dto';

/**
 * A Course mapper object.
 */
export class CourseMapper {
    static fromDTOtoEntity(entityDTO: CourseDTO): Course {
        if (!entityDTO) {
            throw new Error('Invalid input: entityDTO is undefined or null');
        }

        let entity = new Course();

        return Object.assign(entity, entityDTO);
    }

    static fromEntityToDTO(entity: Course): CourseDTO {
        if (!entity) {
            throw new Error('Invalid input: entity is undefined or null');
        }

        let entityDTO = new CourseDTO();

        return Object.assign(entityDTO, entity);
    }
}
