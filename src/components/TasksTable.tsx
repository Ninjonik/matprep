import React, { useState } from 'react';

import { Filter, StandardTable } from '@/components/StandardTable';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import SubjectObject from '@/interfaces/SubjectObject';
import TaskObject from '@/interfaces/TaskObject';
import {
    ColumnFiltersState,
    PaginationState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<TaskObject>();

interface TasksTableProps {
    tasks: TaskObject[];
    setTasks: React.Dispatch<React.SetStateAction<TaskObject[]>>;
    selectedTasks: string[];
    setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>;
    filteredSubjects: string[];
    setFilteredSubjects: React.Dispatch<React.SetStateAction<string[]>>;
    subjects: SubjectObject[];
    setSubjects: React.Dispatch<React.SetStateAction<SubjectObject[]>>;
    selectedSubjects: string[];
    setSelectedSubjects: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TasksTable = ({
    tasks,
    setTasks,
    selectedTasks,
    setSelectedTasks,
    filteredSubjects,
    setFilteredSubjects,
    subjects,
    setSubjects,
    selectedSubjects,
    setSelectedSubjects
}: TasksTableProps) => {
    const rerender = React.useReducer(() => ({}), {})[1];
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const handleTaskToggle = (taskId: string) => {
        setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
    };
    const columns = [
        columnHelper.accessor((row) => row.id, {
            id: 'checkbox',
            cell: (info) => (
                <span className={'flex items-center justify-center'}>
                    <Checkbox
                        id={`task-${info.row.original.id}`}
                        checked={selectedTasks.includes(info.row.original.id)}
                        onCheckedChange={() => handleTaskToggle(info.row.original.id)}
                    />
                </span>
            ),
            header: () => <span className={'m-4 flex items-center justify-center'}>Zahrnúť?</span>,
            meta: {
                filterVariant: 'none'
            }
        }),
        columnHelper.accessor((row) => row.title, {
            id: 'title',
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Názov</span>
        }),
        columnHelper.accessor((row) => row.description, {
            id: 'description',
            cell: (info) => <span>{info.getValue()}</span>,
            header: () => <span>Popis</span>
        }),
        columnHelper.accessor((row) => row.expand.subject.id, {
            id: 'subject',
            cell: (info) => (
                <div>
                    <span className={'text-xs'}>{info.row.original.expand.subject.title}</span>
                </div>
            ),
            header: () => <span>Predmet</span>,
            filterFn: (row, columnId, filterValue) => {
                if (!filterValue || filterValue?.length < 1) return true;

                return filterValue.includes(row.original.expand.subject.id);
            },
            meta: {
                filterVariant: 'multiSelect'
            }
        })
    ];

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    });

    const table = useReactTable({
        data: tasks,
        columns,
        filterFns: {},
        state: {
            columnFilters,
            pagination
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination
    });

    return (
        <div className='mb-8'>
            <h2 className='mb-2 text-xl font-semibold'>2. Vyber témy, ktoré zahrnúť do plánu</h2>
            <h4>Počet zahrnutých tém: {selectedTasks.length}</h4>
            <StandardTable
                table={table}
                title={''}
                data={tasks}
                pagination={true}
                customHeader={table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <>
                                            <div
                                                {...{
                                                    className: header.column.getCanSort()
                                                        ? 'cursor-pointer select-none'
                                                        : '',
                                                    onClick: header.column.getToggleSortingHandler()
                                                }}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽'
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                            {header.column.getCanFilter() && (
                                                <Filter
                                                    column={header.column}
                                                    multiSelect={
                                                        <>
                                                            <MultiSelect
                                                                title='Predmety'
                                                                options={subjects
                                                                    .filter((subject) =>
                                                                        selectedSubjects.includes(subject.id)
                                                                    )
                                                                    .map((subject) => {
                                                                        return {
                                                                            label: subject.title,
                                                                            value: subject.id
                                                                        };
                                                                    })}
                                                                selectedValues={filteredSubjects}
                                                                onSelectionChange={(selectedValues) => {
                                                                    setFilteredSubjects(selectedValues);

                                                                    header.column.setFilterValue(
                                                                        selectedValues && selectedValues.length
                                                                            ? selectedValues
                                                                            : undefined
                                                                    );
                                                                }}
                                                            />
                                                        </>
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                ))}
            />
        </div>
    );
};

export default TasksTable;
