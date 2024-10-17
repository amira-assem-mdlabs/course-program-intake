import { UserCompletedCourseDTO } from '../dto/user-completed-course.dto';
import { UserCompletedCourse } from '../entities/user-completed-course.entity';

export class UserCompletedCourseMapper {
    static fromDTOtoEntity(entityDTO: UserCompletedCourseDTO): UserCompletedCourse {
        if (!entityDTO) {
            return;
        }
        let entity = new UserCompletedCourse();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: UserCompletedCourse): UserCompletedCourseDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new UserCompletedCourseDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
