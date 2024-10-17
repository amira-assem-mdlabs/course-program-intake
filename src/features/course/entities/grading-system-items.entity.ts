import { Entity, BaseEntity, Column, ManyToOne } from 'typeorm';
import { GradingSystem } from './grading-system.entity';

@Entity('grading_system_items')
export class GradingSystemItems extends BaseEntity {
    @Column({ type: 'integer', name: 'item_id', nullable: true })
    itemId: number;

    @Column({ name: 'item_name', nullable: true })
    itemName: string;

    @Column({ type: 'float', name: 'weight', nullable: true })
    weight: number;

    @Column({ name: 'type', nullable: true })
    type: string;

    @ManyToOne(type => GradingSystem)
    system: GradingSystem;
}
