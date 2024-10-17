/* eslint-disable */
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateTrackTable1693953342629 implements MigrationInterface {
    private table = 'track';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'name_en',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'name_ar',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'description_en',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'description_ar',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'jhi_order',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'course_in_order',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'programId',
                        type: 'int4',
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['programId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'program',
                        onDelete: 'CASCADE',
                        name: `${this.table}_programId_fk`,
                    },
                ],
                indices: [
                    {
                        columnNames: ['programId'],
                        name: `IDX_${this.table}_programId`,
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
