import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class TrueOrFalseQuestion1661777058813 implements MigrationInterface {
    private tableName = 'true_or_false_question';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'answer',
                        type: 'boolean',
                        isNullable: false,
                    },
                    {
                        name: 'questionId',
                        type: 'int4',
                        isNullable: false,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['questionId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'question',
                        onDelete: 'CASCADE',
                        name: `${this.tableName}_questionId_fk`,
                    },
                ],
                indices: [
                    {
                        columnNames: ['questionId'],
                        name: `IDX_${this.tableName}_questionId`,
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
