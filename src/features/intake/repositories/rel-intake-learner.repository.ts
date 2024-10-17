import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ContentType } from '../../../common/enumeration/content-type';
import { RelIntakeLearner } from '../entities/rel-intake-learner.entity';

@EntityRepository(RelIntakeLearner)
export class RelIntakeLearnerRepository extends Repository<RelIntakeLearner> {
    createBaseQuery(type: ContentType): SelectQueryBuilder<RelIntakeLearner> {
        const query = this.createQueryBuilder('relIntakeLearner').innerJoinAndSelect(
            'relIntakeLearner.intake',
            'intake',
        );
        switch (type) {
            case ContentType.COURSE:
                query
                    .innerJoin('intake.relIntakeCourses', 'relIntakeCourses')
                    .innerJoin('relIntakeCourses.course', 'course');
                break;
            case ContentType.PROGRAM:
                query
                    .innerJoin('intake.relIntakePrograms', 'relIntakePrograms')
                    .innerJoin('relIntakePrograms.program', 'program');
                break;
            default:
                break;
        }
        return query;
    }

    addContentFilterQuery(
        query: SelectQueryBuilder<RelIntakeLearner>,
        type: ContentType,
        contentId: number,
    ): SelectQueryBuilder<RelIntakeLearner> {
        const relationAlias = type === ContentType.COURSE ? 'course' : 'program';
        return query.andWhere(`${relationAlias}.id = :contentId`, { contentId });
    }
}
