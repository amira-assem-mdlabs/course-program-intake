/* eslint-disable max-classes-per-file */
import { Type, Expose as JsonProperty } from 'class-transformer';
import { BaseEntity } from './base.entity';

export class Sort {
    public property: string;
    public direction: 'ASC' | 'DESC';

    constructor(sort: string) {
        [this.property, this.direction] = sort.split(',') as [string, 'ASC' | 'DESC'];
    }

    asOrder(): Record<string, 'ASC' | 'DESC'> {
        const order: Record<string, 'ASC' | 'DESC'> = {};
        order[this.property] = this.direction;
        return order;
    }
}

export class PageRequest {
    @JsonProperty()
    page: number = 0;
    @JsonProperty()
    size: number = 20;
    @Type(() => Sort)
    sort: Sort = new Sort('id,ASC');

    constructor(page: number | string, size: number | string, sort: string) {
        this.page = +page || this.page;
        this.size = +size || this.size;
        this.sort = sort ? new Sort(sort) : this.sort;
    }
}

export class Page<T extends BaseEntity> {
    constructor(
        public content: T[],
        public total: number,
        public pageable: PageRequest,
    ) {}
}
