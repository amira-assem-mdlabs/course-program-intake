import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

import { AssignmentActivity } from './assignment-activity.entity';

@Entity('assignment_file')
export class AssignmentFile extends BaseEntity {
    @Column({ name: 'title', nullable: true })
    title: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'url' })
    url: string;

    @ManyToOne(type => AssignmentActivity)
    assignment: AssignmentActivity;

    // constructor(url: string, assignment: AssignmentActivity, title?: string, description?: string) {
    //     super();
    //     this.url = url;
    //     this.assignment = assignment;
    //     this.title = title;
    //     this.description = description;
    // }
}
