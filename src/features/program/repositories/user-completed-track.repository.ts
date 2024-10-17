import { EntityRepository, Repository } from 'typeorm';
import { UserCompletedTrack } from '../entities/user-completed-track.entity';

@EntityRepository(UserCompletedTrack)
export class UserCompletedTrackRepository extends Repository<UserCompletedTrack> {}
