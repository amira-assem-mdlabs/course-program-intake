import { LessonScheduleDTO } from '../dto/lesson-schedule.dto';
import { LessonSchedule } from '../entities/lesson-schedule.entity';

export class LessonScheduleMapper {
    static fromDTOtoEntity(entityDTO: LessonScheduleDTO): LessonSchedule {
        if (!entityDTO) {
            return;
        }
        let entity = new LessonSchedule();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: LessonSchedule): LessonScheduleDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new LessonScheduleDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
