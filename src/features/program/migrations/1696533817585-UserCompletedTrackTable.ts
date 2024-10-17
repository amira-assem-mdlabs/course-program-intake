import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class UserCompletedTrackTable1696533817585 implements MigrationInterface {
    private table = 'user_completed_track';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'trackId',
                        type: 'int4',
                        isNullable: false,
                    },
                    {
                        name: 'learnerId',
                        type: 'int4',
                        isNullable: false,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['trackId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'track',
                        onDelete: 'CASCADE',
                        name: `${this.table}_trackId_fk`,
                    },
                    {
                        columnNames: ['learnerId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'nhi_user',
                        onDelete: 'CASCADE',
                        name: `${this.table}_learnerId_fk`,
                    },
                ],
                // TODO: remember to drop learnerId_trackId unique constraint
                uniques: [
                    {
                        columnNames: ['learnerId', 'trackId'],
                        name: `UQ_${this.table}_learnerId_trackId`,
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
