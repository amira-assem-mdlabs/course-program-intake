import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class Category1660049168562 implements MigrationInterface {
    private table = 'category';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [idColumn, ...otherBaseColumns] = baseColumns;
        await queryRunner.createTable(
            new Table({
                name: this.table,
                columns: [
                    idColumn,
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'parentId',
                        type: 'int4',
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['parentId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'category',
                        onDelete: 'CASCADE',
                        name: `${this.table}_parentId_fk`,
                    }),
                ],
            }),
            false,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table, true, true, true);
    }
}
