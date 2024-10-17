import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateRelIntakeCourseTable1699398889612 implements MigrationInterface {
    private table = 'rel_intake_course';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'courseId',
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
                        columnNames: ['courseId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'course',
                        onDelete: 'CASCADE',
                        name: `${this.table}_courseId_fk`,
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
                        name: `UQ_${this.table}_courseId_intakeId`,
                        columnNames: ['courseId', 'intakeId'],
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
