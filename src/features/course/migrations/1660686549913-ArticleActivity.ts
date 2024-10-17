import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class ArticleActivity1660686549913 implements MigrationInterface {
    private tableName = 'article_activity';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'content',
                        type: 'varchar',
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
