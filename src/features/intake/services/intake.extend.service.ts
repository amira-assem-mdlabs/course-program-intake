import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Inject, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';

import { ProgramDTO } from '../../program/dto/program.dto';
import { ContentType } from '../../../common/enumeration/content-type';
import { IntakeStatus } from '../../../common/enumeration/intake-status';
import { SearchCategory } from '../../../common/enumeration/search-category';
import { PageRequest } from '../../../common/entities/pagination.entity';
import { CourseDTO } from '../../course/dto/course.dto';
import { IntakeDTO } from '../dto/intake.dto';
import { Intake } from '../entities/intake.entity';
import { IntakeMapper } from '../mappers/intake.mapper';
import { IntakeRepository } from '../repositories/intake.repository';

const relationshipNames = [];

@Injectable()
export class IntakeService {
    logger = new Logger('IntakeService');
    private intakeRepository: IntakeRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.intakeRepository = connection.getRepository(Intake);
        }
    }

    async findById(id: number, options?: FindManyOptions<IntakeDTO>): Promise<IntakeDTO | undefined> {
        if (options?.relations) {
            options.relations = [...options.relations, ...relationshipNames];
        } else {
            options = { relations: relationshipNames };
        }

        const result = await this.intakeRepository.findOne(id, options);
        return IntakeMapper.fromEntityToDTO(result);
    }

    async findByCategory(
        searchKeyword: string,
        searchCategory: string,
        intakeStatus: string,
        pageRequest: PageRequest,
        sort: string,
    ): Promise<[IntakeDTO[], number]> {
        const query = this.intakeRepository
            .createQueryBuilder('intake')
            .leftJoinAndSelect('intake.intakeStudyPlans', 'intakeStudyPlans');

        if (searchCategory === SearchCategory.COURSES) {
            query
                .innerJoinAndSelect('intake.relIntakeCourses', 'relIntakeCourses')
                .innerJoinAndSelect('relIntakeCourses.course', 'course');
        } else if (searchCategory === SearchCategory.PROGRAMS) {
            query
                .innerJoinAndSelect('intake.relIntakePrograms', 'relIntakePrograms')
                .leftJoinAndSelect('relIntakePrograms.program', 'program')
                .leftJoinAndSelect('intake.relIntakeTracks', 'relIntakeTracks')
                .leftJoinAndSelect('relIntakeTracks.track', 'track');
        } else {
            query
                .leftJoinAndSelect('intake.relIntakeCourses', 'relIntakeCourses')
                .leftJoinAndSelect('relIntakeCourses.course', 'course')
                .leftJoinAndSelect('intake.relIntakePrograms', 'relIntakePrograms')
                .leftJoinAndSelect('relIntakePrograms.program', 'program')
                .leftJoinAndSelect('intake.relIntakeTracks', 'relIntakeTracks')
                .leftJoinAndSelect('relIntakeTracks.track', 'track');
        }

        if (searchKeyword) {
            if (searchCategory === SearchCategory.COURSES) {
                query.where('course.name ilike :name', { name: `%${searchKeyword}%` });
            } else if (searchCategory === SearchCategory.PROGRAMS) {
                query.where('program.nameAr ilike :name', { name: `%${searchKeyword}%` });
            } else if (searchCategory === SearchCategory.INTAKES) {
                query.where('intake.name ilike :name', { name: `%${searchKeyword}%` });
            } else if (searchCategory === SearchCategory.ALL) {
                query
                    .where('course.name ilike :name', { name: `%${searchKeyword}%` })
                    .orWhere('program.nameAr ilike :name', { name: `%${searchKeyword}%` })
                    .orWhere('intake.name ilike :name', { name: `%${searchKeyword}%` });
            }
        }

        if (intakeStatus && intakeStatus !== 'ALL') {
            query.andWhere(`intake.status ${intakeStatus === IntakeStatus.PUBLISHED ? '=' : '!='} :intakeStatus`, {
                intakeStatus: IntakeStatus.PUBLISHED,
            });
        }

        const sortParams = sort.split(',');

        query.orderBy(`intake.${sortParams[0]}`, sortParams[1] as 'ASC' | 'DESC');

        const results = await query
            .skip(+pageRequest.page * +pageRequest.size)
            .take(+pageRequest.size)
            .getMany();

        const count = await query.getCount();

        return [results, count];
    }

    async findByFields(options: FindOneOptions<IntakeDTO>): Promise<IntakeDTO | undefined> {
        const result = await this.intakeRepository.findOne(options);
        return IntakeMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<IntakeDTO>): Promise<[IntakeDTO[], number]> {
        if (options.relations) {
            options.relations = [...options.relations, ...relationshipNames];
        } else {
            options.relations = relationshipNames;
        }

        const resultList = await this.intakeRepository.findAndCount(options);
        const intakeDTO: IntakeDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(intake => intakeDTO.push(IntakeMapper.fromEntityToDTO(intake)));
            resultList[0] = intakeDTO;
        }
        return resultList;
    }

    async save(intakeDTO: IntakeDTO, creator?: string): Promise<IntakeDTO | undefined> {
        const entity = IntakeMapper.fromDTOtoEntity(intakeDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.intakeRepository.save(entity);
        return IntakeMapper.fromEntityToDTO(result);
    }

    async getCourseOrProgramIntakes(
        slug: string,
        slugType: 'COURSE' | 'PROGRAM',
    ): Promise<{
        intakesCount: number;
        currentIntake: IntakeDTO | null;
        upcomingIntake: IntakeDTO | null;
    }> {
        try {
            const baseQuery = this.buildBaseQuery(slug, slugType);
            const count = await baseQuery.getCount();
            const currentIntake = await this.getCurrentIntakeQuery(baseQuery);
            const upcomingIntake = currentIntake ? null : await this.getUpcomingIntakeQuery(baseQuery);

            return {
                intakesCount: count,
                currentIntake,
                upcomingIntake,
            };
        } catch (error) {
            console.error('Error fetching intakes:', error);
            throw new HttpException('Failed to fetch intakes', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private buildBaseQuery(slug: string, slugType: 'COURSE' | 'PROGRAM') {
        return this.intakeRepository
            .createQueryBuilder('intake')
            .leftJoin(`intake.relIntake${slugType === 'COURSE' ? 'Courses' : 'Programs'}`, `relIntake${slugType}`)
            .leftJoin(`relIntake${slugType}.${slugType.toLowerCase()}`, slugType.toLowerCase())
            .where(`${slugType.toLowerCase()}.slug = :slug`, { slug });
    }

    private async getCurrentIntakeQuery(baseQuery: SelectQueryBuilder<Intake>): Promise<IntakeDTO | null> {
        const date = new Date();
        const status = 'PUBLISHED';

        return baseQuery
            .clone()
            .leftJoin('intake.relIntakeLearners', 'relIntakeLearners')
            .andWhere(
                '((intake.registrationStartDate IS NOT NULL AND intake.registrationStartDate <= :date AND COALESCE(intake.registrationEndDate, intake.learningEndDate) >= :date) OR (intake.registrationStartDate IS NULL AND intake.registrationEndDate IS NULL AND intake.learningEndDate >= :date)) AND intake.status = :status',
                { date, status },
            )
            .groupBy('intake.id')
            .having('COUNT(relIntakeLearners.id) < intake.capacity OR (intake.capacity IS NULL)')
            .orderBy('intake.learningStartDate', 'ASC')
            .getOne();
    }

    private async getUpcomingIntakeQuery(baseQuery: SelectQueryBuilder<Intake>): Promise<IntakeDTO | null> {
        const date = new Date();
        const status = 'PUBLISHED';

        return baseQuery
            .clone()
            .leftJoin('intake.relIntakeLearners', 'relIntakeLearners')
            .andWhere('intake.registrationStartDate IS NOT NULL')
            .andWhere('intake.registrationStartDate >= :date', { date })
            .andWhere('intake.status = :status', { status })
            .groupBy('intake.id')
            .having('COUNT(relIntakeLearners.id) < intake.capacity OR (intake.capacity IS NULL)')
            .orderBy('intake.learningStartDate', 'ASC')
            .getOne();
    }

    async update(intakeDTO: IntakeDTO, updater?: string): Promise<IntakeDTO | undefined> {
        const entity = IntakeMapper.fromDTOtoEntity(intakeDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.intakeRepository.save(entity);
        return IntakeMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.intakeRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async fetchIntakeEntityTypeAndId(
        intakeId: number,
    ): Promise<{ intake: IntakeDTO; entityType: 'Course' | 'Program'; entity: CourseDTO | ProgramDTO } | null> {
        const intake = await this.findByFields({
            where: { id: intakeId },
            relations: [
                'relIntakeCourses',
                'relIntakeCourses.course',
                'relIntakePrograms',
                'relIntakePrograms.program',
                'relIntakeTracks',
                'relIntakeTracks.track',
                'intakeStudyPlans',
            ],
        });
        if (!intake) throw new HttpException('intake not found', HttpStatus.NOT_FOUND);
        if (intake.relIntakeCourses && intake.relIntakeCourses.length > 0) {
            return { intake, entityType: 'Course', entity: intake.relIntakeCourses[0].course };
        } else if (intake.relIntakePrograms && intake.relIntakePrograms.length > 0) {
            return { intake, entityType: 'Program', entity: intake.relIntakePrograms[0].program };
        }

        return null;
    }

    async getIntakesFilteredByRelations(options: {
        programId?: number;
        courseId?: number;
    }): Promise<[IntakeDTO[], number]> {
        const { programId, courseId } = options;
        const query = this.intakeRepository.createQueryBuilder('intake');

        if (programId) {
            query
                .innerJoinAndSelect('intake.relIntakePrograms', 'relIntakePrograms')
                .innerJoinAndSelect('relIntakePrograms.program', 'program')
                .andWhere('program.id = :programId', { programId });
        }
        if (courseId) {
            query
                .innerJoinAndSelect('intake.relIntakeCourses', 'relIntakeCourses')
                .innerJoinAndSelect('relIntakeCourses.course', 'course')
                .andWhere('course.id = :courseId', { courseId });
        }

        const [results, count] = await Promise.all([query.getMany(), query.getCount()]);

        return [results, count];
    }

    async getFinishedIntakes(type: string, intakeId: number) {
        const intakesQuery = this.intakeRepository.createQueryBuilder('intake');

        if (type === ContentType.COURSE) {
            return await this.updateUpcomingCoursesIntakes(intakesQuery, intakeId);
        } else if (type === ContentType.PROGRAM) {
            return await this.updateUpcomingProgramsIntakes(intakesQuery, intakeId);
        }
    }

    updateUpcomingCoursesIntakes = async (query: SelectQueryBuilder<Intake>, intakeId: number) => {
        const coursesIntakesQuery = query
            .clone()
            .innerJoinAndSelect('intake.relIntakeCourses', 'relIntakeCourses')
            .leftJoinAndSelect('relIntakeCourses.course', 'course');

        // Query the finished intakes which have only the failed student(s)
        const finishedIntakes: Intake[] = await coursesIntakesQuery
            .clone()
            .innerJoinAndSelect('intake.relIntakeLearners', 'relIntakeLearners')
            .leftJoinAndSelect('relIntakeLearners.learner', 'learner')
            .leftJoinAndSelect('course.userCompletedCourses', 'userCompletedCourses')
            .leftJoinAndSelect('userCompletedCourses.course', 'finishedCourse')
            .leftJoinAndSelect('userCompletedCourses.learner', 'passedLearner')
            .andWhere('intake.learningEndDate < :today', { today: new Date().toISOString().split('T')[0] })
            .andWhere(
                'learner.id != passedLearner.id OR passedLearner.id IS NULL OR course.id != finishedCourse.id OR finishedCourse.id IS NULL',
            )
            .getMany();

        if (finishedIntakes && finishedIntakes.length > 0) {
            const upcomingIntake: Intake = await this.intakeRepository.findOne(intakeId, {
                relations: [
                    'relIntakeCourses',
                    'relIntakeCourses.course',
                    'relIntakeLearners',
                    'relIntakeLearners.learner',
                ],
            });

            if (upcomingIntake) {
                return {
                    upcomingIntake,
                    finishedIntakes,
                };
            }
        }
        return;
    };

    updateUpcomingProgramsIntakes = async (query: SelectQueryBuilder<Intake>, intakeId: number) => {
        const programsIntakesQuery = query
            .clone()
            .innerJoinAndSelect('intake.relIntakePrograms', 'relIntakePrograms')
            .leftJoinAndSelect('relIntakePrograms.program', 'program');

        // Query the finished intakes which have only the failed student(s)
        const finishedIntakes: Intake[] = await programsIntakesQuery
            .clone()
            .innerJoinAndSelect('intake.relIntakeLearners', 'relIntakeLearners')
            .leftJoinAndSelect('relIntakeLearners.learner', 'learner')
            .leftJoinAndSelect('program.userProgramCertificates', 'userProgramCertificates')
            .leftJoinAndSelect('userProgramCertificates.program', 'finishedProgram')
            .leftJoinAndSelect('userProgramCertificates.user', 'passedLearner')
            .andWhere('intake.learningEndDate < :today', { today: new Date().toISOString().split('T')[0] })
            .andWhere(
                'learner.id != passedLearner.id OR passedLearner.id IS NULL OR program.id != finishedProgram.id OR finishedProgram.id IS NULL',
            )
            .getMany();

        if (finishedIntakes && finishedIntakes.length > 0) {
            const upcomingIntake: Intake = await this.intakeRepository.findOne(intakeId, {
                relations: [
                    'relIntakePrograms',
                    'relIntakePrograms.program',
                    'relIntakeLearners',
                    'relIntakeLearners.learner',
                ],
            });

            if (upcomingIntake) {
                return {
                    upcomingIntake,
                    finishedIntakes,
                };
            }
        }
        return;
    };

    async getIntakeNames(intakeIds: number[]) {
        if (!intakeIds || intakeIds.length === 0) {
            return new Map();
        }
        const query = this.intakeRepository
            .createQueryBuilder('intake')
            .select(['intake.id', 'intake.name'])
            .where('intake.id IN (:...intakeIds)', { intakeIds });
        const result = await query.getMany();

        const intakeMap = new Map(result.map(intake => [intake.id, intake.name]));

        return intakeMap;
    }

    async getIntakeName(intakeIds: number[]) {
        if (!intakeIds || intakeIds.length === 0) {
            return null;
        }
        const query = this.intakeRepository
            .createQueryBuilder('intake')
            .select(['intake.name'])
            .where('intake.id =:...intakeIds', { intakeIds });
        return await query.getOne();
    }
}
