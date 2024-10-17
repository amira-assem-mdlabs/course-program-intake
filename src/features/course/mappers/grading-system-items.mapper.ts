// import { GradingSystemItemsDTO } from '../dto/grading-system-items.dto';
// import { GradingSystemItems } from '../entities/grading-system-items.entity';

// export class GradingSystemItemsMapper {
//     static fromDTOtoEntity(entityDTO: GradingSystemItemsDTO): GradingSystemItems {
//         if (!entityDTO) {
//             return;
//         }
//         let entity = new GradingSystemItems();
//         const fields = Object.getOwnPropertyNames(entityDTO);
//         fields.forEach(field => {
//             entity[field] = entityDTO[field];
//         });
//         return entity;
//     }

//     static fromEntityToDTO(entity: GradingSystemItems): GradingSystemItemsDTO {
//         if (!entity) {
//             return;
//         }
//         let entityDTO = new GradingSystemItemsDTO();

//         const fields = Object.getOwnPropertyNames(entity);

//         fields.forEach(field => {
//             entityDTO[field] = entity[field];
//         });

//         return entityDTO;
//     }
// }
