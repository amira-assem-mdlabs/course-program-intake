/* eslint-disable */
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateRelTrackCourseTable1693992634037 implements MigrationInterface {
    private table = 'rel_track_course';
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
                        isNullable: true,
                    },
                    {
                        name: 'courseId',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'jhi_order',
                        type: 'int4',
                        isNullable: true,
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
                        columnNames: ['courseId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'course',
                        onDelete: 'CASCADE',
                        name: `${this.table}_courseId_fk`,
                    },
                ],
                uniques: [
                    {
                        name: `UQ_${this.table}_trackId_courseId`,
                        columnNames: ['trackId', 'courseId'],
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
