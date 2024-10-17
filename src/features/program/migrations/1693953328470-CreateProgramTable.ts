/* eslint-disable */
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class CreateProgramTable1693953328470 implements MigrationInterface {
    private table = 'program';
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
                        name: 'cover_url',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'intro_video_url',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'start_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'end_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'meta_data',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['PUBLISHED', 'DRAFT'],
                        isNullable: true,
                    },
                    {
                        name: 'track_certificate',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'course_certificate',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'track_in_order',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'featured',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'categoryId',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'price',
                        type: 'float8',
                        isNullable: true,
                    },
                    {
                        name: 'discount_price',
                        type: 'float8',
                        isNullable: true,
                    },
                    {
                        name: 'published_by',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'publish_date',
                        type: 'date',
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['categoryId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'category',
                        onDelete: 'CASCADE',
                        name: `${this.table}_categoryId_fk`,
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
