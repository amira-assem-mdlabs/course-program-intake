import { EntityRepository, Repository } from "typeorm";
import { RelIntakeTrack } from "../entities/rel-intake-track.entity";

@EntityRepository(RelIntakeTrack)
export class RelIntakeTrackRepository extends Repository<RelIntakeTrack> {}
