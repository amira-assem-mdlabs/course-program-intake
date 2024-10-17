import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateRelIntakeTrackTable1699399551088 implements MigrationInterface {
    private table = 'rel_intake_track';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'trackId',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'intakeId',
                        type: 'int4',
                        isNullable: false,
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
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['trackId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'track',
                        onDelete: 'CASCADE',
                        name: `${this.table}_trackId_fk`,
                    },
                    {
                        columnNames: ['intakeId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'intake',
                        onDelete: 'CASCADE',
                        name: `${this.table}_intakeId_fk`,
                    },
                ],
                uniques: [
                    {
                        name: `UQ_${this.table}_trackId_intakeId`,
                        columnNames: ['trackId', 'intakeId'],
                    },
                ],
            }),
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table, true, true, true);
    }
}
