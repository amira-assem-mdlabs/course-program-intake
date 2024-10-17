import { EntityRepository, Repository } from 'typeorm';
import { AssignmentFile } from '../entities/assignment-file.entity';

@EntityRepository(AssignmentFile)
export class AssignmentFileRepository extends Repository<AssignmentFile> {}
