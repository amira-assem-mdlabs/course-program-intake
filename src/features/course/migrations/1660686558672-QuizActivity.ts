import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class QuizActivity1660686558672 implements MigrationInterface {
    private tableName = 'quiz_activity';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'time',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'number_of_attempts',
                        type: 'int4',
                        isNullable: false,
                        default: 1,
                    },
                    {
                        name: 'jhi_order',
                        type: 'int4',
                    },
                    {
                        name: 'show_correct_answer',
                        type: 'boolean',
                    },
                    {
                        name: 'pass_rate',
                        type: 'float',
                        isNullable: false,
                    },
                    {
                        name: 'activityId',
                        type: 'int4',
                        isNullable: false,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['activityId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'activity',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_activityId_fk`,
                    },
                ],
                indices: [
                    {
                        name: `IDX_${this.tableName}_activityId`,
                        columnNames: ['activityId'],
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
