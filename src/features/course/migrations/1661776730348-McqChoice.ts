import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class McqChoice1661776730348 implements MigrationInterface {
    private table = 'mcq_choice';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'is_answer',
                        type: 'boolean',
                        isNullable: false,
                    },
                    {
                        name: 'mcqQuestionId',
                        type: 'int4',
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['mcqQuestionId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'mcq_question',
                        onDelete: 'CASCADE',
                        name: `${this.table}_mcq_question_fk`,
                    },
                ],
                indices: [
                    {
                        name: `IDX_${this.table}_mcqQuestionId`,
                        columnNames: ['mcqQuestionId'],
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
