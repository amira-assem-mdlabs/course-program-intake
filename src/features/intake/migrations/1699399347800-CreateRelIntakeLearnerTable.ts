import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateRelIntakeLearnerTable1699399347800 implements MigrationInterface {
    private table = 'rel_intake_learner';
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
                        isNullable: false,
                    },
                    {
                        name: 'intakeId',
                        type: 'int4',
                        isNullable: false,
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
                        columnNames: ['intakeId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'intake',
                        onDelete: 'CASCADE',
                        name: `${this.table}_intakeId_fk`,
                    },
                ],
                uniques: [
                    {
                        name: `UQ_${this.table}_learnerId_intakeId`,
                        columnNames: ['learnerId', 'intakeId'],
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
