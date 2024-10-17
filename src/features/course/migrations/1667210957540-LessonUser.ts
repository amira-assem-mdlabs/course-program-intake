import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class LessonUser1667210957540 implements MigrationInterface {
    private tableName = 'rel_lesson_learner';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'lessonId',
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
                        columnNames: ['learnerId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'nhi_user',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_learnerId_fk`,
                    },
                    {
                        columnNames: ['lessonId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'lesson',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_lessonId_fk`,
                    },
                ],
                // TODO: remember to drop learnerId_lessonId unique constraint
                uniques: [
                    {
                        name: `UQ_${this.tableName}_learnerId_lessonId`,
                        columnNames: ['learnerId', 'lessonId'],
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
