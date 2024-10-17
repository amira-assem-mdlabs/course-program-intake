import { CONNECTION } from '@amira_assem_mdlabs/nestjs-multi-tenancy';
import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Connection, FindManyOptions, FindOneOptions } from 'typeorm';
import { UserCompletedTrackDTO } from '../dto/user-completed-track.dto';
import { UserCompletedTrack } from '../entities/user-completed-track.entity';
import { UserCompletedTrackMapper } from '../mappers/user-completed-track.mapper';
import { UserCompletedTrackRepository } from '../repositories/user-completed-track.repository';

const relationshipNames = [];
relationshipNames.push('learner');
relationshipNames.push('track');

@Injectable()
export class UserCompletedTrackService {
    logger = new Logger('UserCompletedTrackService');

    private userCompletedTrackRepository: UserCompletedTrackRepository;

    constructor(@Inject(CONNECTION) connection: Connection) {
        if (connection) {
            this.userCompletedTrackRepository = connection.getRepository(UserCompletedTrack);
        }
    }

    async findById(id: number): Promise<UserCompletedTrackDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.userCompletedTrackRepository.findOne(id, options);
        return UserCompletedTrackMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<UserCompletedTrackDTO>): Promise<UserCompletedTrackDTO | undefined> {
        const result = await this.userCompletedTrackRepository.findOne(options);
        return UserCompletedTrackMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<UserCompletedTrackDTO>): Promise<[UserCompletedTrackDTO[], number]> {
        options.relations = relationshipNames;
        const [results, count] = await this.userCompletedTrackRepository.findAndCount(options);
        const userCompletedTrackDTO: UserCompletedTrackDTO[] = results.map(result =>
            UserCompletedTrackMapper.fromEntityToDTO(result),
        );
        return [userCompletedTrackDTO, count];
    }

    async save(
        userCompletedTrackDTO: UserCompletedTrackDTO,
        creator?: string,
    ): Promise<UserCompletedTrackDTO | undefined> {
        const entity = UserCompletedTrackMapper.fromDTOtoEntity(userCompletedTrackDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.userCompletedTrackRepository.save(entity);
        return UserCompletedTrackMapper.fromEntityToDTO(result);
    }

    async update(
        userCompletedTrackDTO: UserCompletedTrackDTO,
        updater?: string,
    ): Promise<UserCompletedTrackDTO | undefined> {
        const entity = UserCompletedTrackMapper.fromDTOtoEntity(userCompletedTrackDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.userCompletedTrackRepository.save(entity);
        return UserCompletedTrackMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.userCompletedTrackRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }

    async getLearnerCompletedTracksInProgram(learnerId: number, programId: number): Promise<number> {
        const result = await this.userCompletedTrackRepository
            .createQueryBuilder('userCompletedTrack')
            .leftJoin('userCompletedTrack.learner', 'learner')
            .leftJoin('userCompletedTrack.track', 'track')
            .leftJoin('track.program', 'program')
            .select(['COUNT(DISTINCT track.id) AS tracks', 'learner.id'])
            .addSelect('learner.id')
            .where('learner.id = :learnerId', { learnerId })
            .andWhere('program.id = :programId', { programId })
            .groupBy('learner.id')
            .getRawOne();

        return result && result.tracks ? Number(result.tracks) : 0;
    }
}
