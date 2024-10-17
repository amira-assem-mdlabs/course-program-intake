import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Course } from './course.entity';

@Entity('keyword')
export class Keyword extends BaseEntity {
    @Column({ name: 'name' })
    name: string;

    @ManyToMany(type => Course)
    courses: Course[];

    // constructor(name: string) {
    //     super();
    //     this.name = name;
    //     this.courses = [];
    // }
}
