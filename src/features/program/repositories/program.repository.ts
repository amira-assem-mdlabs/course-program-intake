import { EntityRepository, Repository } from "typeorm";
import { Program } from "../entities/program.entity";

@EntityRepository(Program)
export class ProgramRepository extends Repository<Program> {}
