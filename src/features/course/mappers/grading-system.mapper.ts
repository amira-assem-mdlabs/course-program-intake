// import { GradingSystemDTO } from '../dto/grading-system.dto';
// import { GradingSystem } from '../entities/grading-system.entity';

// export class GradingSystemMapper {
//     static fromDTOtoEntity(entityDTO: GradingSystemDTO): GradingSystem {
//         if (!entityDTO) {
//             return;
//         }
//         let entity = new GradingSystem();
//         const fields = Object.getOwnPropertyNames(entityDTO);
//         fields.forEach(field => {
//             entity[field] = entityDTO[field];
//         });
//         return entity;
//     }

//     static fromEntityToDTO(entity: GradingSystem): GradingSystemDTO {
//         if (!entity) {
//             return;
//         }
//         let entityDTO = new GradingSystemDTO();

//         const fields = Object.getOwnPropertyNames(entity);

//         fields.forEach(field => {
//             entityDTO[field] = entity[field];
//         });

//         return entityDTO;
//     }
// }
