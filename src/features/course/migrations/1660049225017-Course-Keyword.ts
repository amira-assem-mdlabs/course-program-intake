import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CourseKeyword1660049225017 implements MigrationInterface {
    private readonly tableName = 'rel_course__keyword';

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
                        name: 'keyword_id',
                        type: 'int4',
                        isNullable: false,
                    },
                    ...otherBaseColumns,
                ],
                uniques: [
                    {
                        name: `PK_${this.tableName}`,
                        columnNames: ['course_id', 'keyword_id'],
                    },
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
                        columnNames: ['keyword_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'keyword',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_keyword_id_fk`,
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
