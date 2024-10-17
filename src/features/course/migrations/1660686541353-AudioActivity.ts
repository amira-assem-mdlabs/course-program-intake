import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class AudioActivity1660686541353 implements MigrationInterface {
    private tableName = 'audio_activity';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    idColumn,
                    {
                        name: 'audio_url',
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
        await queryRunner.query(`DROP TABLE ${this.tableName}`);
    }
}
