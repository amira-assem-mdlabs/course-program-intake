import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class VideoActivity1660686533700 implements MigrationInterface {
    private readonly tableName = 'video_activity';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;

        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'video_url',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'mandatory_watching',
                        type: 'boolean',
                        default: false,
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
