import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Lesson } from './lesson.entity';
import { Course } from './course.entity';

@Entity('section')
export class Section extends BaseEntity {
    @Column({ name: 'slug', nullable: true })
    slug: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ type: 'integer', name: 'jhi_order', nullable: true })
    order: number;

    @OneToMany(type => Lesson, other => other.section)
    lessons: Lesson[];

    @ManyToOne(type => Course)
    course: Course;

    // constructor(name: string, course: Course, slug?: string, description?: string, order?: number) {
    //     super();
    //     this.name = name;
    //     this.course = course;
    //     this.slug = slug ?? null;
    //     this.description = description ?? null;
    //     this.order = order ?? null;
    //     this.lessons = [];
    // }
}
