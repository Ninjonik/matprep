import React, { ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UITable } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { Column, RowData, Table } from '@tanstack/table-core';

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select' | 'multiSelect' | 'none' | 'number';
    }
}

interface ActionInterface {
    text: string;
    link?: string;
    link2?: string;
    onClick?: () => void;
    icon: ReactNode;
    color: 'yellow' | 'blue' | 'red' | 'green' | 'cyan' | 'purple';
    accessor?: string;
}

const _usedClasses = [
    'text-yellow-500',
    'text-blue-500',
    'text-red-500',
    'text-green-500',
    'text-cyan-500',
    'text-purple-500',
    'text-yellow-600',
    'text-blue-600',
    'text-red-600',
    'text-green-600',
    'text-cyan-600',
    'text-purple-600'
];

interface ComponentProps {
    title: string;
    data: any;
    pagination?: boolean;
    header?: boolean;
    table: Table<any>;
    actions?: ActionInterface[];
    customHeader?: ReactNode;
    id?: string;
    state?: any[];
    setState?: React.Dispatch<React.SetStateAction<any>>;
    buttonName?: string;
    buttonTo?: string;
    additionalData?: any;
    customButton?: ReactNode;
    customParams?: any[];
}

export function StandardTable({
    title,
    data,
    header = true,
    pagination = false,
    table,
    actions,
    customHeader,
    id,
    state,
    setState,
    buttonName,
    buttonTo,
    additionalData,
    customButton,
    customParams
}: ComponentProps) {
    return (
        <div className='flex flex-col gap-2 overflow-x-auto'>
            <div className={'flex flex-row items-center justify-between'}>
                <h3>{title}</h3>
                {buttonName && buttonTo && (
                    <a className={'btn btn-primary'} href={buttonTo}>
                        {buttonName}
                    </a>
                )}
                {customButton}
            </div>
            <UITable className='table-zebra table'>
                {header && (
                    <TableHeader>
                        {customHeader
                            ? customHeader
                            : table.getHeaderGroups().map((headerGroup) => (
                                  <TableRow key={headerGroup.id}>
                                      {headerGroup.headers.map((header) => (
                                          <TableHead key={header.id} colSpan={header.colSpan} className={'p-4'}>
                                              {!header.isPlaceholder && (
                                                  <>
                                                      <div
                                                          {...{
                                                              className: header.column.getCanSort()
                                                                  ? 'cursor-pointer select-none'
                                                                  : '',
                                                              onClick: header.column.getToggleSortingHandler()
                                                          }}>
                                                          {flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext()
                                                          )}
                                                          {{
                                                              asc: ' 🔼',
                                                              desc: ' 🔽'
                                                          }[header.column.getIsSorted() as string] ?? null}
                                                      </div>
                                                      {header.column.getCanFilter() && (
                                                          <Filter column={header.column} />
                                                      )}
                                                  </>
                                              )}
                                          </TableHead>
                                      ))}
                                  </TableRow>
                              ))}
                    </TableHeader>
                )}

                <TableBody>
                    {data.length > 0 ? (
                        <>
                            {table.getRowModel().rows.map((row, index) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={row.id + cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell className={'inline-flex items-center gap-2 text-2xl'}>
                                        {actions &&
                                            actions.length > 0 &&
                                            actions.map((action, index) => (
                                                <a
                                                    className={`text-${action.color}-500 hover:text-${action.color}-600 flex h-8 items-center justify-center`}
                                                    href={
                                                        action.link
                                                            ? `${action.link || ''}${action?.accessor ? row.original[action.accessor] : row.original.id}${action?.link2 || ''}`
                                                            : undefined
                                                    }
                                                    onClick={action.onClick ? action.onClick : undefined}
                                                    title={action.text}
                                                    key={row.id + index}>
                                                    {action.icon}
                                                </a>
                                            ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    ) : (
                        <tr>
                            <td colSpan={6} className={'text-center'}>
                                Neboli nájdené žiadne {title.toLowerCase()}.
                            </td>
                        </tr>
                    )}
                </TableBody>
            </UITable>
            {pagination && (
                <div className={'flex flex-col gap-2'}>
                    <div className='flex items-center gap-2'>
                        <button
                            className='rounded border p-1'
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()}>
                            {'<<'}
                        </button>
                        <button
                            className='rounded border p-1'
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>
                            {'<'}
                        </button>
                        <button
                            className='rounded border p-1'
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}>
                            {'>'}
                        </button>
                        <button
                            className='rounded border p-1'
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()}>
                            {'>>'}
                        </button>
                        <span className='flex items-center gap-1'>
                            <div>Strana</div>
                            <strong>
                                {table.getState().pagination.pageIndex + 1} z {table.getPageCount().toLocaleString()}
                            </strong>
                        </span>
                        <span className='flex items-center gap-1'>
                            | Ísť na stranu:
                            <input
                                type='number'
                                min='1'
                                max={table.getPageCount()}
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    table.setPageIndex(page);
                                }}
                                className='w-16 rounded border p-1'
                            />
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export function Filter({
    column,
    select,
    multiSelect
}: {
    column: Column<any>;
    select?: ReactNode;
    multiSelect?: ReactNode;
}) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};

    if (filterVariant === 'none') return;

    if (filterVariant === 'range') {
        return (
            <div>
                <div className='flex space-x-2'>
                    <DebouncedInput
                        type='number'
                        value={(columnFilterValue as [number, number])?.[0] ?? ''}
                        onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
                        placeholder={`Min`}
                    />
                    <DebouncedInput
                        type='number'
                        value={(columnFilterValue as [number, number])?.[1] ?? ''}
                        onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
                        placeholder={`Max`}
                    />
                </div>
                <div className='h-1' />
            </div>
        );
    }

    if (filterVariant === 'select') {
        return select || null;
    }

    if (filterVariant === 'multiSelect') {
        return multiSelect || null;
    }

    if (filterVariant === 'number') {
        return (
            <DebouncedInput
                onChange={(value) => column.setFilterValue(parseInt(value as string))}
                placeholder={`Filtrovať...`}
                type='number'
                value={(columnFilterValue ?? '') as number}
            />
        );
    }

    return (
        <DebouncedInput
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Filtrovať...`}
            type='text'
            value={(columnFilterValue ?? '') as string}
        />
    );
}

export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} className='input input-xs mt-2' />
    );
}
