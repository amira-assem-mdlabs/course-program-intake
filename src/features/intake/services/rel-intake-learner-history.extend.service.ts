import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ContentType } from '../../../common/enumeration/content-type';
import { IntakeStatus } from '../../../common/enumeration/intake-status';

import { RelIntakeLearnerHistoryRepository } from '../repositories/rel-intake-learner-history.repository';
import { RelIntakeLearnerRepository } from '../repositories/rel-intake-learner.repository';
import { RelIntakeLearnerHistory } from '../entities/rel-intake-learner-history.entity';

const relationshipNames = [];
relationshipNames.push('learner');
relationshipNames.push('intake');

@Injectable()
export class RelIntakeLearnerHistoryExtendService {
    logger = new Logger('RelIntakeLearnerHistoryExtendService');

    private relIntakeLearnerRepository: RelIntakeLearnerRepository;
    private relIntakeLearnerHistoryRepository: RelIntakeLearnerHistoryRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relIntakeLearnerRepository = connection.getCustomRepository(RelIntakeLearnerRepository);
            this.relIntakeLearnerHistoryRepository = connection.getRepository(RelIntakeLearnerHistory);
        }
    }

    async create(learnerId: number, intakeId: number, entityType: string) {
        const isHistoryExist = await this.checkIfHistoryExists(learnerId, intakeId);
        if (isHistoryExist) return;

        let history;

        if (entityType === ContentType.COURSE) {
            history = await this.getCourseIntakeHistoryData(learnerId, intakeId);
        } else {
            history = await this.getProgramIntakeHistoryData(learnerId, intakeId);
        }
        return await this.relIntakeLearnerHistoryRepository.save(history);
    }

    private async checkIfHistoryExists(learnerId: number, intakeId: number): Promise<boolean> {
        const history = await this.relIntakeLearnerHistoryRepository.findOne({
            where: {
                learner: learnerId,
                intake: intakeId,
            },
        });
        if (history) return true;
        return false;
    }

    private async getCourseIntakeHistoryData(learnerId: number, intakeId: number) {
        const history = await this.relIntakeLearnerRepository
            .createQueryBuilder('relIntakeLearner')
            .innerJoinAndSelect('relIntakeLearner.intake', 'intake', 'intake.id = :intakeId', { intakeId: intakeId })
            .where('intake.status = :intakeStatus', { intakeStatus: IntakeStatus.PUBLISHED })
            .innerJoinAndSelect('relIntakeLearner.learner', 'learner', 'learner.id = :learnerId', {
                learnerId: learnerId,
            })
            .select('learner.id', 'learner')
            .addSelect('intake.id', 'intake')
            .addSelect(
                `COALESCE(((COUNT(DISTINCT rel_lesson_learner.id)::FLOAT / NULLIF(COUNT(DISTINCT lesson.id), 0)::FLOAT) * 100.0)::DECIMAL(10,2), 0)::FLOAT`,
                'progress',
            )
            .leftJoin('intake.relIntakeCourses', 'relIntakeCourse')
            .leftJoin('relIntakeCourse.course', 'course')
            .leftJoin('course.sections', 'section')
            .leftJoin('section.lessons', 'lesson')
            .leftJoin(
                'lesson.relLessonLearners',
                'rel_lesson_learner',
                '"rel_lesson_learner"."learnerId" = "learner"."id"',
            )
            .groupBy('relIntakeLearner.id')
            .addGroupBy('intake.id')
            .addGroupBy('learner.id')
            .addGroupBy('relIntakeCourse.id')
            .addGroupBy('course.id')
            .getRawOne();
        return history;
    }

    private async getProgramIntakeHistoryData(learnerId: number, intakeId: number) {
        const history = await this.relIntakeLearnerRepository
            .createQueryBuilder('relIntakeLearner')
            .innerJoinAndSelect('relIntakeLearner.intake', 'intake', 'intake.id = :intakeId', { intakeId: intakeId })
            .where('intake.status = :intakeStatus', { intakeStatus: IntakeStatus.PUBLISHED })
            .innerJoinAndSelect('relIntakeLearner.learner', 'learner', 'learner.id = :learnerId', {
                learnerId: learnerId,
            })
            .select('learner.id', 'learner')
            .addSelect('intake.id', 'intake')
            .addSelect(
                `((COUNT(DISTINCT completed_courses.id)::FLOAT / NULLIF(COUNT(DISTINCT course.id), 0)::FLOAT) * 100.0) ::DECIMAL(10,2)`,
                'progress',
            )
            .addSelect(`unique_scores.final_score`, 'score')
            .leftJoin('intake.relIntakePrograms', 'relIntakeProgram')
            .leftJoin('relIntakeProgram.program', 'program')
            .leftJoin('program.tracks', 'track')
            .leftJoin('track.relTrackCourses', 'relTrackCourse')
            .leftJoin('relTrackCourse.course', 'course')
            .leftJoin(
                'learner.userCompletedCourses',
                'completed_courses',
                'completed_courses.learnerId = learner.id AND completed_courses.courseId =course.id',
            )
            .leftJoin(
                subquery => {
                    return subquery
                        .from('program', 'sub_query_program')
                        .leftJoin('sub_query_program.tracks', 'track')
                        .leftJoin('track.relTrackCourses', 'relTrackCourse')
                        .leftJoin('relTrackCourse.course', 'course')
                        .leftJoin(
                            'user_completed_course',
                            'user_completed_course',
                            'course.id = user_completed_course.courseId',
                        )
                        .leftJoin('user_completed_course.learner', 'learner')
                        .where('user_completed_course.score is not null')
                        .select(
                            'COALESCE((SUM(user_completed_course.score)::FLOAT / NULLIF(COUNT(DISTINCT user_completed_course.courseId), 0)::FLOAT)::DECIMAL(10,2),0)::FLOAT',
                            'final_score',
                        )
                        .addSelect('sub_query_program.id', 'sub_query_program_id')
                        .addSelect('learner.id', 'sub_query_learner_id')
                        .groupBy('sub_query_program.id')
                        .addGroupBy('learner.id');
                },
                'unique_scores',
                'program.id = unique_scores.sub_query_program_id AND unique_scores.sub_query_learner_id = learner.id',
            )
            .groupBy('relIntakeLearner.id')
            .addGroupBy('intake.id')
            .addGroupBy('learner.id')
            .addGroupBy('relIntakeProgram.id')
            .addGroupBy('program.id')
            .addGroupBy('unique_scores.final_score')
            .getRawOne();
        return history;
    }
}
