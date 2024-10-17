import { Entity, BaseEntity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { GradingSystemItems } from './grading-system-items.entity';

@Entity('grading_system')
export class GradingSystem extends BaseEntity {
    @Column({ type: 'float', name: 'passing_grade', nullable: true })
    passingGrade: number;

    @OneToOne(type => Course)
    @JoinColumn()
    course: Course;

    @OneToMany(type => GradingSystemItems, other => other.system)
    gradingSystemItems: GradingSystemItems[];

    // @Column({ type: 'simple-enum', name: 'certificate_policy', enum: CertificatePolicyType })
    // certificatePolicy: CertificatePolicyType;
}
