import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateRelLearnerProgramTable1693992900423 implements MigrationInterface {
    private table = 'rel_learner_program';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'learnerId',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'programId',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'jhi_order',
                        type: 'int4',
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['learnerId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'nhi_user',
                        onDelete: 'CASCADE',
                        name: `${this.table}_learnerId_fk`,
                    },
                    {
                        columnNames: ['programId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'program',
                        onDelete: 'CASCADE',
                        name: `${this.table}_programId_fk`,
                    },
                ],
                uniques: [
                    {
                        name: `UQ_${this.table}_learnerId_programId`,
                        columnNames: ['learnerId', 'programId'],
                    },
                ],
                // indices: [
                //     {
                //         name: `IDX_${this.table}_programId`,
                //         columnNames: ['programId'],
                //     },
                // ],
            }),
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table, true, true, true);
    }
}
