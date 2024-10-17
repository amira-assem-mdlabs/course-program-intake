import { Injectable, Logger, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { RelIntakeLearnerRepository } from '../repositories/rel-intake-learner.repository';
import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { ContentType } from '../../../common/enumeration/content-type';
import { IntakeContentType } from '../../../common/enumeration/intake-content-type';
import { IntakeDTO } from '../dto/intake.dto';
import { FindIntakeByLearnerOptionsDTO } from '../dto/intake.extend.dto';
import { RelIntakeLearnerDTO } from '../dto/rel-intake-learner.dto';
import { Intake } from '../entities/intake.entity';
import { RelIntakeLearnerMapper } from '../mappers/rel-intake-learner.mapper';

const relationshipNames = [];
relationshipNames.push('learner');
relationshipNames.push('intake');

@Injectable()
export class RelIntakeLearnerService {
    logger = new Logger('RelIntakeLearnerService');

    private relIntakeLearnerRepository: RelIntakeLearnerRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.relIntakeLearnerRepository = connection.getCustomRepository(RelIntakeLearnerRepository);
        }
    }

    async findById(id: number): Promise<RelIntakeLearnerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.relIntakeLearnerRepository.findOne(id, options);
        return RelIntakeLearnerMapper.fromEntityToDTO(result);
    }

    async save(relIntakeLearnerDTO: RelIntakeLearnerDTO, creator?: string): Promise<RelIntakeLearnerDTO | undefined> {
        const entity = RelIntakeLearnerMapper.fromDTOtoEntity(relIntakeLearnerDTO);
        entity.createdDate = new Date();
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }

        const result = await this.relIntakeLearnerRepository.save(entity);

        return RelIntakeLearnerMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<RelIntakeLearnerDTO>): Promise<RelIntakeLearnerDTO | undefined> {
        const result = await this.relIntakeLearnerRepository.findOne(options);
        return RelIntakeLearnerMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<RelIntakeLearnerDTO>): Promise<[RelIntakeLearnerDTO[], number]> {
        options.relations = relationshipNames;
        const [results, count] = await this.relIntakeLearnerRepository.findAndCount(options);
        const relIntakeLearnerDTO: RelIntakeLearnerDTO[] = results.map(relIntakeLearner =>
            RelIntakeLearnerMapper.fromEntityToDTO(relIntakeLearner),
        );
        return [relIntakeLearnerDTO, count];
    }

    async findIntakeByLearner({
        learnerId,
        programId,
        courseId,
    }: FindIntakeByLearnerOptionsDTO): Promise<IntakeDTO | null> {
        try {
            const query = this.relIntakeLearnerRepository
                .createQueryBuilder('relIntakeLearner')
                .innerJoinAndSelect('relIntakeLearner.intake', 'intake')
                .where('relIntakeLearner.learnerId = :learnerId', { learnerId });

            if (programId) {
                query
                    .leftJoinAndSelect('intake.relIntakeTracks', 'relIntakeTracks')
                    .innerJoinAndSelect('intake.relIntakePrograms', 'relIntakePrograms')
                    .leftJoinAndSelect('relIntakeTracks.track', 'track')
                    .innerJoin('relIntakePrograms.program', 'program')
                    .andWhere('program.id = :programId', { programId })
                    .orderBy('track.order', 'ASC');
            }

            if (courseId) {
                query
                    .innerJoinAndSelect('intake.relIntakeCourses', 'relIntakeCourses')
                    .innerJoin('relIntakeCourses.course', 'course')
                    .andWhere('course.id = :courseId', { courseId });
            }

            const result = await query.getOne();

            return result ? result.intake : null;
        } catch (error) {
            throw new HttpException(error.message || 'Error, relIntakeLearner not found!', HttpStatus.BAD_REQUEST);
        }
    }

    enrollFailedStudents = async (
        upcomingIntake: Intake,
        finishedIntakes: Intake[],
        intakeContentType: IntakeContentType,
    ) => {
        // If there're upcoming intakes
        if (upcomingIntake) {
            let upcomingIntakeCourseId: number;
            let upcomingIntakeProgramId: number;

            if (intakeContentType === IntakeContentType.COURSE) {
                upcomingIntakeCourseId = upcomingIntake.relIntakeCourses[0].course.id;
            } else if (intakeContentType === IntakeContentType.PROGRAM) {
                upcomingIntakeProgramId = upcomingIntake.relIntakePrograms[0].program.id;
            }

            // Transfer each of the failed students one by one if the following criteria is met:
            // - The upcoming intake has an available seat
            // - The failed student has not been already transferred before by the cron job

            for (const [index, finishedIntake] of finishedIntakes.entries()) {
                for (const relLearner of finishedIntake.relIntakeLearners) {
                    const failedStudent = relLearner.learner;
                    let finishedIntakeCourseId: number;
                    let finishedIntakeProgramId: number;

                    if (intakeContentType === IntakeContentType.COURSE) {
                        finishedIntakeCourseId = finishedIntake.relIntakeCourses[0].course.id;
                    } else if (intakeContentType === IntakeContentType.PROGRAM) {
                        finishedIntakeProgramId = finishedIntake.relIntakePrograms[0].program.id;
                    }

                    // Check if the finished intake id is the same of that in the upcoming intake
                    // (i.e The upcoming intake of the finished one)
                    let isCourseUpcomingIntake: boolean;
                    let isProgramUpcomingIntake: boolean;

                    if (intakeContentType === IntakeContentType.COURSE) {
                        isCourseUpcomingIntake = finishedIntakeCourseId === upcomingIntakeCourseId;
                    } else if (intakeContentType === IntakeContentType.PROGRAM) {
                        isProgramUpcomingIntake = finishedIntakeProgramId === upcomingIntakeProgramId;
                    }

                    const isUpcomingIntake = isCourseUpcomingIntake || isProgramUpcomingIntake;

                    // Check if the current failed student doesn't exist in the upcoming intake students list
                    // (i.e has not been already transferred before by the cron job)
                    const canTransfer =
                        upcomingIntake.relIntakeLearners.find(
                            relIntakeLearner => relIntakeLearner.learner.id === failedStudent.id,
                        ) === undefined;

                    if (isUpcomingIntake && canTransfer) {
                        const finishedRelIntakeLearner = await this.relIntakeLearnerRepository.findOne({
                            intake: finishedIntake,
                            learner: failedStudent,
                        });

                        if (finishedRelIntakeLearner) {
                            try {
                                await this.relIntakeLearnerRepository.remove(finishedRelIntakeLearner);

                                await this.relIntakeLearnerRepository.save({
                                    intake: upcomingIntake,
                                    learner: failedStudent,
                                    createdBy: `${intakeContentType}_INTAKE_CRON_JOB_SERVICE@<${new Date().toLocaleString()}>`,
                                });
                            } catch (e) {
                                console.error('Failed to transfer failed student', e);
                            }
                        }
                    }
                }
            }
        }
    };

    async findLearnerEnrolledIntakeByEntity(
        entityId: number,
        learnerId: number,
        type: ContentType,
    ): Promise<RelIntakeLearnerDTO> {
        let query = this.relIntakeLearnerRepository.createBaseQuery(type);

        query = this.relIntakeLearnerRepository
            .addContentFilterQuery(query, type, entityId)
            .select([
                'relIntakeLearner.id',
                'intake.id',
                'intake.registrationStartDate',
                'intake.registrationEndDate',
                'intake.learningStartDate',
                'intake.learningEndDate',
                'intake.capacity',
            ])
            .where('relIntakeLearner.learnerId = :learnerId', { learnerId });

        return await query.getOne();
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.relIntakeLearnerRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
