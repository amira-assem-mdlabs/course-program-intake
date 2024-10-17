import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class Activity1660686532700 implements MigrationInterface {
    private readonly tableName = 'activity';

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
                            name: 'name',
                            type: 'varchar',
                            isNullable: false,
                        },
                        {
                            name: 'type',
                            type: 'enum',
                            enum: ['AUDIO', 'VIDEO', 'ARTICLE', 'QUIZ', 'ASSIGNMENT', 'HTML'],
                            isNullable: false,
                        },
                        {
                            name: 'description',
                            type: 'varchar',
                            isNullable: true,
                        },
                        {
                            name: 'jhi_order',
                            type: 'int4',
                            isNullable: true,
                        },
                        {
                            name: 'download',
                            type: 'boolean',
                            default: true,
                        },
                        {
                            name: 'lessonId',
                            type: 'int4',
                            isNullable: true,
                        },
                        ...otherBaseColumns,
                    ],
                    foreignKeys: [
                        {
                            columnNames: ['lessonId'],
                            referencedColumnNames: ['id'],
                            referencedTableName: 'lesson',
                            onDelete: 'CASCADE',
                            name: `${this.tableName}_lessonId_fk`,
                        },
                    ],
                    indices: [
                        {
                            columnNames: ['lessonId'],
                            name: `IDX_${this.tableName}_lessonId`,
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
