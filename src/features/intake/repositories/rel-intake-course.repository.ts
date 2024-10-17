import { EntityRepository, Repository } from "typeorm";
import { RelIntakeCourse } from "../entities/rel-intake-course.entity";

@EntityRepository(RelIntakeCourse)
export class RelIntakeCourseRepository extends Repository<RelIntakeCourse> {}
