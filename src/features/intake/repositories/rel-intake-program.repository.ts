import { EntityRepository, Repository } from "typeorm";
import { RelIntakeProgram } from "../entities/rel-intake-program.entity";

@EntityRepository(RelIntakeProgram)
export class RelIntakeProgramRepository extends Repository<RelIntakeProgram> {}
