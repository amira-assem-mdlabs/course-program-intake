import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CourseUser1660049186367 implements MigrationInterface {
    private readonly tableName = 'rel_course__user';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [, ...otherBaseColumns] = baseColumns;

        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    {
                        name: 'course_id',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'int4',
                        isNullable: false,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['course_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'course',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_course_id_fk`,
                    },
                    {
                        columnNames: ['user_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'nhi_user',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_user_id_fk`,
                    },
                ],
                uniques: [
                    {
                        name: `UQ_${this.tableName}_course_id_user_id`,
                        columnNames: ['course_id', 'user_id'],
                    },
                ],
            }),
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName, true, true, true);
    }
}
