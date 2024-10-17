import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Lesson } from './lesson.entity';
import { ILearner } from '../../../common/interfaces/learner.interface';

@Entity('rel_lesson_learner')
export class RelLessonLearner extends BaseEntity {
    @ManyToOne('nhi_user')
    learner: ILearner;

    @ManyToOne(type => Lesson)
    lesson: Lesson;

    // constructor(learner: ILearner, lesson: Lesson) {
    //     super();
    //     this.learner = learner;
    //     this.lesson = lesson;
    // }
}
