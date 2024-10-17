import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseColumns } from '../../../common/migrations/get-base-columns';

export class Course1660049177828 implements MigrationInterface {
    private readonly table = 'course';

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
                        name: 'slug',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'education_hours',
                        type: 'float8',
                        isNullable: true,
                    },
                    {
                        name: 'image_url',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'video_url',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'summary',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'level',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['DRAFT', 'SUPENDED', 'PUBLISHED'],
                        isNullable: true,
                    },
                    {
                        name: 'is_public',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'allow_course_review',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'show_lecturer',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'show_enrollments',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'publish_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'publish_by',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'end_date',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'lesson_order',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'mainCategoryId',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'subCategoryId',
                        type: 'int4',
                        isNullable: true,
                    },
                    {
                        name: 'price',
                        type: 'float8',
                        isNullable: true,
                    },
                    {
                        name: 'dicount_price',
                        type: 'float8',
                        isNullable: true,
                    },
                    ...otherBaseColumns,
                ],
                foreignKeys: [
                    {
                        columnNames: ['mainCategoryId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'category',
                        onDelete: 'CASCADE',
                        name: `${this.table}_mainCategoryId_fk`,
                    },
                    {
                        columnNames: ['subCategoryId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'category',
                        onDelete: 'CASCADE',
                        name: `${this.table}_subCategoryId_fk`,
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
