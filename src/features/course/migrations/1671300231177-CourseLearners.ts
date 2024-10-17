import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CourseLearners1671300231177 implements MigrationInterface {
    private readonly tableName = 'rel_course_learner';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
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
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['courseId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'course',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_courseId_fk`,
                    },
                    {
                        columnNames: ['learnerId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'nhi_user',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_learnerId_fk`,
                    },
                ],
                uniques: [
                    {
                        name: `UQ_${this.tableName}_learnerId_courseId`,
                        columnNames: ['learnerId', 'courseId'],
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
