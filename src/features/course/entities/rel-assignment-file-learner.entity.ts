import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RelAssignmentLearner } from './rel-assignment-learner.entity';

@Entity('rel_assignment_file_learner')
export class RelAssignmentFileLearner extends BaseEntity {
    @Column({ name: 'name', nullable: true })
    name: string | null;

    @Column({ name: 'url' })
    url: string;

    @ManyToOne(type => RelAssignmentLearner)
    learnerAssignment: RelAssignmentLearner;

    // constructor(url: string, learnerAssignment: RelAssignmentLearner, name?: string) {
    //     super();
    //     this.url = url;
    //     this.learnerAssignment = learnerAssignment;
    //     this.name = name || null;
    // }
}
