import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { UserCompletedCourseMapper } from '../mappers/user-completed-course.mapper';
import { UserCompletedCourse } from '../entities/user-completed-course.entity';
import { UserCompletedCourseDTO } from '../dto/user-completed-course.dto';
import { UserCompletedCourseRepository } from '../repositories/user-completed-course.repository';

const relationshipNames = [];
relationshipNames.push('learner');
relationshipNames.push('course');

@Injectable()
export class UserCompletedCourseService {
    logger = new Logger('UserCompletedCourseService');

    private userCompletedCourseRepository: UserCompletedCourseRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.userCompletedCourseRepository = connection.getRepository(UserCompletedCourse);
        }
    }

    async findById(id: number): Promise<UserCompletedCourseDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.userCompletedCourseRepository.findOne(id, options);
        return UserCompletedCourseMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<UserCompletedCourseDTO>): Promise<UserCompletedCourseDTO | undefined> {
        const result = await this.userCompletedCourseRepository.findOne(options);
        return UserCompletedCourseMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<UserCompletedCourseDTO>): Promise<[UserCompletedCourseDTO[], number]> {
        options.relations = relationshipNames;
        const [result, count] = await this.userCompletedCourseRepository.findAndCount(options);
        const userCompletedCourseDTO: UserCompletedCourseDTO[] = result.map(userCompletedCourse =>
            UserCompletedCourseMapper.fromEntityToDTO(userCompletedCourse),
        );

        return [userCompletedCourseDTO, count];
    }

    async save(
        userCompletedCourseDTO: UserCompletedCourseDTO,
        creator?: string,
    ): Promise<UserCompletedCourseDTO | undefined> {
        const entity = UserCompletedCourseMapper.fromDTOtoEntity(userCompletedCourseDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.userCompletedCourseRepository.save(entity);
        return UserCompletedCourseMapper.fromEntityToDTO(result);
    }

    async update(
        userCompletedCourseDTO: UserCompletedCourseDTO,
        updater?: string,
    ): Promise<UserCompletedCourseDTO | undefined> {
        const entity = UserCompletedCourseMapper.fromDTOtoEntity(userCompletedCourseDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.userCompletedCourseRepository.save(entity);
        return UserCompletedCourseMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.userCompletedCourseRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async getLearnerCompletedCoursesInTrack(learnerId: number, trackId: number): Promise<number> {
        const result = await this.userCompletedCourseRepository
            .createQueryBuilder('user_completed_course')
            .leftJoin('user_completed_course.learner', 'learner')
            .leftJoin('user_completed_course.course', 'course')
            .leftJoin('course.relTrackCourses', 'relTrackCourses')
            .leftJoin('relTrackCourses.track', 'track')
            .select(['COUNT(DISTINCT course.id) AS courses', 'learner.id'])
            .where('learner.id = :learnerId', { learnerId })
            .andWhere('track.id = :trackId', { trackId })
            .groupBy('learner.id')
            .getRawOne();

        return result && result.courses ? Number(result.courses) : 0;
    }
}
