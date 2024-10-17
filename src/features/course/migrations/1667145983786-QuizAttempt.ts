import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class QuizAttempt1667145983786 implements MigrationInterface {
    private readonly tableName = 'quiz_attempt';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;

        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'quizId',
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
                        columnNames: ['quizId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'quiz_activity',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_quizId_fk`,
                    },
                    {
                        columnNames: ['learnerId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'nhi_user',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_learnerId_fk`,
                    },
                ],
                indices: [
                    {
                        columnNames: ['learnerId', 'quizId'],
                        name: `IDX_${this.tableName}_learnerId_quizId`,
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
