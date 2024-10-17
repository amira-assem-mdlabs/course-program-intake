import { EntityRepository, Repository } from 'typeorm';
import { RelTrackCourse } from '../entities/rel-track-course.entity';

@EntityRepository(RelTrackCourse)
export class RelTrackCourseRepository extends Repository<RelTrackCourse> {}
