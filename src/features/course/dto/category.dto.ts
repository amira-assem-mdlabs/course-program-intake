import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { BaseDTO } from '../../../common/dto/base.dto';
import { ProgramDTO } from '../../program/dto/program.dto';

export class CategoryDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiProperty({ description: 'name field' })
    name: string;

    @ApiProperty({ type: () => CategoryDTO, isArray: true, description: 'categories relationship' })
    categories: CategoryDTO[];

    @ApiProperty({ type: () => ProgramDTO, isArray: true, description: 'programs relationship' })
    programs: ProgramDTO[];

    @ApiProperty({ type: () => CategoryDTO, description: 'parent relationship' })
    parent: CategoryDTO;

    // constructor(name: string, categories?: CategoryDTO[], programs?: ProgramDTO[], parent?: CategoryDTO) {
    //     super();
    //     this.name = name;
    //     this.categories = categories ?? null;
    //     this.programs = programs ?? null;
    //     this.parent = parent ?? null;
    // }
}
