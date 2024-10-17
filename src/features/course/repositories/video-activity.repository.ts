import { EntityRepository, Repository } from 'typeorm';
import { VideoActivity } from '../entities/video-activity.entity';

@EntityRepository(VideoActivity)
export class VideoActivityRepository extends Repository<VideoActivity> {}
