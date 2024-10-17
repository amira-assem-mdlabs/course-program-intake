import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { BaseDTO } from '../../../common/dto/base.dto';

export class ExtendedHtmlActivityDTO extends BaseDTO {
    @IsNotEmpty({ message: 'htmlUrl cannot be empty' })
    @IsUrl({}, { message: 'htmlUrl is not a valid URL' })
    @ApiProperty({ description: 'htmlUrl field' })
    htmlUrl: string;

    // constructor(htmlUrl: string) {
    //     super();
    //     this.htmlUrl = htmlUrl;
    // }
}
