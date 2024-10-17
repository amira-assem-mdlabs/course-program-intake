import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class Lesson1660685866304 implements MigrationInterface {
    private table = 'lesson';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'slug',
                        type: 'varchar',
                        isNullable: true,
                        isUnique: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
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
                        name: 'sectionId',
                        type: 'int4',
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['sectionId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'section',
                        onDelete: 'CASCADE',
                        name: `${this.table}_sectionId_fk`,
                    },
                ],
                indices: [
                    {
                        columnNames: ['sectionId'],
                        name: `IDX_${this.table}_sectionId`,
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
