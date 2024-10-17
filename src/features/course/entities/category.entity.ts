import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Program } from '../../program/entities/program.entity';

@Entity('category')
export class Category extends BaseEntity {
    @Column({ name: 'name' })
    name: string;

    @OneToMany(type => Category, other => other.parent)
    categories: Category[];

    @OneToMany(type => Program, other => other.category)
    programs: Program[];

    @ManyToOne(type => Category)
    parent: Category;

    // constructor(name: string, parent?: Category | null) {
    //     super();
    //     this.name = name;
    //     this.parent = parent || null;
    //     this.categories = [];
    //     this.programs = [];
    // }
}
