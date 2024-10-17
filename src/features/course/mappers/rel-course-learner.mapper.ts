import { RelCourseLearner } from '../entities/rel-course-learner.entity';
import { RelCourseLearnerDTO } from '../dto/rel-course-learner.dto';

export class RelCourseLearnerMapper {
    static fromDTOtoEntity(entityDTO: RelCourseLearnerDTO): RelCourseLearner {
        if (!entityDTO) {
            throw new Error('Invalid input: entityDTO is undefined or null');
        }

        let entity = new RelCourseLearner();

        return Object.assign(entity, entityDTO);
    }

    static fromEntityToDTO(entity: RelCourseLearner): RelCourseLearnerDTO {
        if (!entity) {
            throw new Error('Invalid input: entity is undefined or null');
        }

        let entityDTO = new RelCourseLearnerDTO();

        return Object.assign(entityDTO, entity);
    }
}
