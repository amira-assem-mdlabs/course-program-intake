import { Brackets, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { CourseStatus } from '../../../common/enumeration/course-status';
import { IntakeStatus } from '../../../common/enumeration/intake-status';
import { Course } from '../entities/course.entity';

@EntityRepository(Course)
export class CourseRepository extends Repository<Course> {
    getBaseQueryBuilder(addGroupBy: boolean = false): SelectQueryBuilder<Course> {
        const query = this.createQueryBuilder('course')
            .leftJoin('course.mainCategory', 'category')
            .leftJoin('course.users', 'lecturer')
            .select([
                'course.id',
                'course.name',
                'course.slug',
                'course.description',
                'course.imageUrl',
                'course.publishDate',
                'category.id',
                'category.name',
                'lecturer.id',
                'lecturer.firstName',
                'lecturer.lastName',
                'lecturer.imageUrl',
                'lecturer.bio',
            ]);
        if (addGroupBy) {
            query.addGroupBy('course.id, category.id, lecturer.id');
        }
        return query;
    }

    getRawBaseQueryBuilder(): SelectQueryBuilder<Course> {
        return this.createQueryBuilder('course')
            .select([
                'course.id AS id',
                'course.slug AS slug',
                'course.name AS name',
                'course.description AS description',
                'course.image_url AS "imageUrl"',
                'course.publishDate AS "startDate"',
                `json_build_object(
                    'id', category.id,
                    'name', category.name
                ) AS category`,
                `json_build_object(
                    'id', lecturer.id,
                    'firstName', lecturer.firstName,
                    'lastName', lecturer.lastName,
                    'imageUrl', lecturer.imageUrl
                ) AS lecturer`,
            ])
            .leftJoin('course.mainCategory', 'category')
            .leftJoin('course.users', 'lecturer');
    }

    withEnrollmentCount(query: SelectQueryBuilder<Course>): SelectQueryBuilder<Course> {
        return query
            .addSelect('CAST(COUNT(courseLearners.id) AS INTEGER) AS "enrollmentCount"')
            .leftJoin('course.relCourseLearners', 'courseLearners');
    }

    withActiveCourseConstraints(query: SelectQueryBuilder<Course>): SelectQueryBuilder<Course> {
        return query
            .andWhere('course.status = :status', { status: CourseStatus.PUBLISHED })
            .andWhere('course.isPublic = true')
            .andWhere('course.publishDate <= NOW()')
            .andWhere(
                new Brackets(qb => {
                    qb.where('course.endDate IS NULL').orWhere('course.endDate > NOW()');
                }),
            );
    }

    withValidIntakes(query: SelectQueryBuilder<Course>, userId?: number): SelectQueryBuilder<Course> {
        return query
            .innerJoin('course.relIntakeCourses', 'relIntakeCourses')
            .innerJoin('relIntakeCourses.intake', 'intake')
            .leftJoin('intake.relIntakeLearners', 'ril')
            .loadRelationCountAndMap('intake.enrollmentCount', 'intake.relIntakeLearners', 'relIntakeLearner')
            .andWhere(
                new Brackets(qb => {
                    qb.where('intake.registrationEndDate IS NULL OR intake.registrationEndDate >= CURRENT_TIMESTAMP')
                        .andWhere('intake.status = :status', { status: IntakeStatus.PUBLISHED })
                        .andWhere('intake.learningEndDate > CURRENT_TIMESTAMP');

                    if (userId) {
                        qb.orWhere('ril.learnerId = :userId', { userId });
                    }
                }),
            )
            .addSelect([
                'relIntakeCourses.id',
                'intake.id',
                'intake.name',
                'intake.registrationStartDate',
                'intake.registrationEndDate',
                'intake.learningStartDate',
                'intake.learningEndDate',
                'intake.capacity',
            ])
            .addGroupBy('relIntakeCourses.id, intake.id, intake.capacity')
            .having(
                `COUNT(DISTINCT ril.id) < MAX(intake.capacity) OR MAX(intake.capacity) IS NULL` +
                    (userId ? ` OR SUM(CASE WHEN ril.learnerId = :userId THEN 1 ELSE 0 END) > 0` : ''),
                { userId },
            );
    }

    withContent(query: SelectQueryBuilder<Course>, addGroupBy: boolean = false): SelectQueryBuilder<Course> {
        const newQuery = query
            .leftJoin('course.sections', 'section')
            .leftJoin('section.lessons', 'lesson')
            .addSelect(['section.id', 'section.name', 'lesson.id', 'lesson.name']);

        if (addGroupBy) {
            newQuery.addGroupBy('section.id, lesson.id');
        }

        return newQuery;
    }
}
