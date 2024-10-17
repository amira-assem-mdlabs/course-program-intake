import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AssignmentActivity } from './assignment-activity.entity';
import { RelAssignmentFileLearner } from './rel-assignment-file-learner.entity';
import { ILearner } from '../../../common/interfaces/learner.interface';

@Entity('rel_assignment_learner')
export class RelAssignmentLearner extends BaseEntity {
    @Column({ type: 'float', name: 'grade', nullable: true })
    grade: number;

    @Column({ type: 'boolean', name: 'is_submitted', nullable: true })
    isSubmitted: boolean;

    @Column({ name: 'submission_date', nullable: true })
    submissionDate: string;

    @Column({ name: 'lecturer_notes', nullable: true })
    lecturerNotes: string;

    @Column({ name: 'feedback_file_url', nullable: true })
    feedbackFileUrl: string;

    @Column({ name: 'correction_date', nullable: true })
    correctionDate: string;

    @Column({ name: 'learner_note', nullable: true })
    learnerNote: string;

    @OneToMany(type => RelAssignmentFileLearner, other => other.learnerAssignment)
    relAssignmentFileLearners: RelAssignmentFileLearner[];

    @ManyToOne('nhi_user')
    learner: ILearner;

    @ManyToOne(type => AssignmentActivity)
    assignment: AssignmentActivity;

    // constructor(
    //     learner: ILearner,
    //     assignment: AssignmentActivity,
    //     isSubmitted: boolean = false,
    //     grade?: number,
    //     submissionDate?: string,
    //     lecturerNotes?: string,
    //     feedbackFileUrl?: string,
    //     correctionDate?: string,
    //     learnerNote?: string,
    // ) {
    //     super();
    //     this.learner = learner;
    //     this.assignment = assignment;
    //     this.isSubmitted = isSubmitted;
    //     this.grade = grade ?? null;
    //     this.submissionDate = submissionDate ?? null;
    //     this.lecturerNotes = lecturerNotes ?? null;
    //     this.feedbackFileUrl = feedbackFileUrl ?? null;
    //     this.correctionDate = correctionDate ?? null;
    //     this.learnerNote = learnerNote ?? null;
    //     this.relAssignmentFileLearners = [];
    // }
}
