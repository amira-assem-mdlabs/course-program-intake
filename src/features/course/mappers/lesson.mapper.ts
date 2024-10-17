import { Lesson } from '../entities/lesson.entity';
import { LessonDTO } from '../dto/lesson.dto';

export class LessonMapper {
    static fromDTOtoEntity(entityDTO: LessonDTO): Lesson {
        if (!entityDTO) {
            throw new Error('Invalid input: entityDTO is undefined or null');
        }

        let entity = new Lesson();

        return Object.assign(entity, entityDTO);
    }

    static fromEntityToDTO(entity: Lesson): LessonDTO {
        if (!entity) {
            throw new Error('Invalid input: entity is undefined or null');
        }

        let entityDTO = new LessonDTO();

        return Object.assign(entityDTO, entity);
    }
}
