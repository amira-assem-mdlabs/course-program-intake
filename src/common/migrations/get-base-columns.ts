import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

export const baseColumns: TableColumnOptions[] = [
    {
        name: 'id',
        type: 'int4',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
    },
    {
        name: 'createdDate',
        type: 'timestamptz',
        isNullable: true,
        default: 'now()',
    },
    {
        name: 'createdBy',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'lastModifiedDate',
        type: 'timestamptz',
        isNullable: true,
    },
    {
        name: 'lastModifiedBy',
        type: 'varchar',
        isNullable: true,
    },
];
