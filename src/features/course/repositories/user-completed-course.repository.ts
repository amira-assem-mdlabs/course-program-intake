import { EntityRepository, Repository } from 'typeorm';
import { UserCompletedCourse } from '../entities/user-completed-course.entity';

@EntityRepository(UserCompletedCourse)
export class UserCompletedCourseRepository extends Repository<UserCompletedCourse> {}
