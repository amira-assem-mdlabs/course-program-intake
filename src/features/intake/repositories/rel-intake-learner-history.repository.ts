import { EntityRepository, Repository } from "typeorm";
import { RelIntakeLearnerHistory } from "../entities/rel-intake-learner-history.entity";

@EntityRepository(RelIntakeLearnerHistory)
export class RelIntakeLearnerHistoryRepository extends Repository<RelIntakeLearnerHistory> {}
