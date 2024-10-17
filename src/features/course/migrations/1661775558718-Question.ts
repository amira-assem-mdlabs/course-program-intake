import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class Question1661775558718 implements MigrationInterface {
    private tableName = 'question';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableExists = await queryRunner.hasTable(this.tableName);
        if (!tableExists) {
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
                            name: 'type',
                            type: 'enum',
                            enum: ['MCQ', 'SHORT_ANSWER', 'TRUE_OR_FALSE'],
                            isNullable: false,
                        },
                        {
                            name: 'quizActivityId',
                            type: 'int4',
                            isNullable: false,
                        },
                        ...otherBaseColumns,
                    ],
                    foreignKeys: [
                        {
                            columnNames: ['quizActivityId'],
                            referencedColumnNames: ['id'],
                            referencedTableName: 'quiz_activity',
                            onDelete: 'CASCADE',
                            name: `${this.tableName}_quizActivityId_fk`,
                        },
                    ],
                    indices: [
                        {
                            columnNames: ['quizActivityId'],
                            name: `IDX_${this.tableName}_quizActivityId`,
                        },
                    ],
                }),
                false,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName, true, true, true);
    }
}
