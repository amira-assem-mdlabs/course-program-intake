import { EntityRepository, Repository } from 'typeorm';
import { Keyword } from '../entities/keyword.entity';

@EntityRepository(Keyword)
export class KeywordRepository extends Repository<Keyword> {}
