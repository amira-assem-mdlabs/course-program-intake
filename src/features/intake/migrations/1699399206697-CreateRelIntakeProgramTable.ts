import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateRelIntakeProgramTable1699399206697 implements MigrationInterface {
    private table = 'rel_intake_program';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'programId',
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
                        columnNames: ['programId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'program',
                        onDelete: 'CASCADE',
                        name: `${this.table}_programId_fk`,
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
                        name: `UQ_${this.table}_programId_intakeId`,
                        columnNames: ['programId', 'intakeId'],
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
