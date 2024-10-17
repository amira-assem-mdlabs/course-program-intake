import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class Answer1667146508658 implements MigrationInterface {
    private readonly tableName = 'quiz_answer';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;

        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'attemptId',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'questionId',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'is_right',
                        type: 'bool',
                        isNullable: false,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['attemptId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'quiz_attempt',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_attemptId_fk`,
                    },
                    {
                        columnNames: ['questionId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'question',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_questionId_fk`,
                    },
                ],
                uniques: [
                    {
                        // TODO: rename constraint to UQ_questionId_attemptId
                        name: `questionId_attemptId`,
                        columnNames: ['questionId', 'attemptId'],
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName, true, true, true);
    }
}
