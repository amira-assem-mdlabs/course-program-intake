import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class UserCompletedCoursesTable1696438665522 implements MigrationInterface {
    private table = 'user_completed_course';
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
                        name: 'learnerId',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'score',
                        type: 'float4',
                        isNullable: true,
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
                        columnNames: ['learnerId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'nhi_user',
                        onDelete: 'CASCADE',
                        name: `${this.table}_learnerId_fk`,
                    },
                ],
                // TODO: remember to drop learnerId_courseId unique constraint
                uniques: [
                    {
                        columnNames: ['learnerId', 'courseId'],
                        name: `UQ_${this.table}_learnerId_courseId`,
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
