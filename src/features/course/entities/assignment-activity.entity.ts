import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

import { Activity } from './activity.entity';
import { AssignmentFile } from './assignment-file.entity';
import { RelAssignmentLearner } from './rel-assignment-learner.entity';

@Entity('assignment_activity')
export class AssignmentActivity extends BaseEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ type: 'float', name: 'grade', nullable: true })
    grade: number;

    @Column({ type: 'integer', name: 'duration', nullable: true })
    duration: number;

    @Column({ type: 'integer', name: 'num_of_files', nullable: true })
    numOfFiles: number;

    @Column({ name: 'file_type', nullable: true })
    fileType: string;

    @OneToOne(type => Activity)
    @JoinColumn()
    activity: Activity;

    @OneToMany(type => AssignmentFile, other => other.assignment)
    assignmentFiles: AssignmentFile[];

    @OneToMany(type => RelAssignmentLearner, other => other.assignment)
    relAssignmentLearners: RelAssignmentLearner[];

    // constructor(
    //     title: string,
    //     activity: Activity,
    //     fileType: string,
    //     description?: string,
    //     grade?: number,
    //     duration?: number,
    //     numOfFiles?: number,
    // ) {
    //     super();
    //     this.title = title;
    //     this.activity = activity;
    //     this.description = description ?? null;
    //     this.grade = grade ?? null;
    //     this.duration = duration ?? null;
    //     this.numOfFiles = numOfFiles ?? null;
    //     this.fileType = fileType;
    //     this.assignmentFiles = [];
    //     this.relAssignmentLearners = [];
    // }
}
