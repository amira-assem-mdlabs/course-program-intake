import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateIntakeTable1699398511048 implements MigrationInterface {
    private table = 'intake';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'registration_start_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'registration_end_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'learning_start_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'learning_end_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'capacity',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['DRAFT', 'PUBLISHED', 'FINISHED'],
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
            }),
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table, true, true, true);
    }
}
