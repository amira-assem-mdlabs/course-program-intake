import { EntityRepository, Repository } from 'typeorm';
import { AudioActivity } from '../entities/audio-activity.entity';

@EntityRepository(AudioActivity)
export class AudioActivityRepository extends Repository<AudioActivity> {}
