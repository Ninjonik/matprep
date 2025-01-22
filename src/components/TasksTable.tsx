import React, { useState } from 'react';

import { Filter, StandardTable } from '@/components/StandardTable';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import SubjectObject from '@/interfaces/SubjectObject';
import TaskObject from '@/interfaces/TaskObject';
import {
    ColumnFiltersState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable
} from '@tanstack/react-table';
import { base_url } from '@/components/PocketBaseContext';
import getFileIcon from '@/utils/getFileIcon';

const columnHelper = createColumnHelper<TaskObject>();

interface TasksTableProps {
    tasks: TaskObject[];
    selectedTasks: string[];
    setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>;
    filteredSubjects: string[];
    setFilteredSubjects: React.Dispatch<React.SetStateAction<string[]>>;
    subjects: SubjectObject[];
    selectedSubjects: string[];
    page?: "index" | "settings";
    completedTasks?: string[];
    setCompletedTasks?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TasksTable = ({
    tasks,
    selectedTasks,
    setSelectedTasks,
    filteredSubjects,
    setFilteredSubjects,
    subjects,
    selectedSubjects,
    page = "settings",
    completedTasks,
    setCompletedTasks
}: TasksTableProps) => {
    const rerender = React.useReducer(() => ({}), {})[1];
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const handleTaskToggle = (taskId: string) => {
        if(completedTasks && setCompletedTasks){
            return setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
        }
        setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
    };

    const columns = [
        columnHelper.accessor((row) => row.id, {
            id: 'checkbox',
            cell: (info) => (
                <span className={'flex items-center justify-center'}>
                    <Checkbox
                        id={`task-${info.row.original.id}`}
                        checked={(completedTasks && setCompletedTasks) ? completedTasks.includes(info.row.original.id) : selectedTasks.includes(info.row.original.id)}
                        onCheckedChange={() => handleTaskToggle(info.row.original.id)}
                    />
                </span>
            ),
            header: () => <span className={'m-4 flex items-center justify-center'}>{page === "settings" ? "Zahrnúť?" : "Hotovo?"}</span>,
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
            cell: (info) => <span className={"hidden md:block"}>{info.getValue()}</span>,
            header: () => <span className={"hidden md:block"}>Popis</span>
        }),
        columnHelper.accessor((row) => row.attachments, {
            id: 'attachments',
            cell: (info) => <span className={""}>{info.getValue().length > 0 && (
                info.getValue().map((attachment) => (
                    <a key={`${info.row.original.id}_${attachment}`} href={`${base_url}/api/files/tasks/${info.row.original.id}/${attachment}`} title={attachment} className={"hover:scale-150 transition-all"}>{getFileIcon(attachment.split('.').pop() || '')}</a>
                ))
            )}</span>,
            header: () => <span className={""}></span>,
            meta: {
                filterVariant: "none",
            }
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
        }),
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
            {page === "settings" ? (
            <>
                <h2 className='mb-2 text-xl font-semibold'>2. Vyber témy, ktoré zahrnúť do plánu</h2>
                <h4>Počet zahrnutých tém: {selectedTasks.length}</h4>
            </>) : (
                <div>
                    <h4>Počet zahrnutých tém: {selectedTasks.length}</h4>
                    <h4>Počet dokončených tém: {completedTasks?.length || 0} ({completedTasks?.length || 0 / selectedTasks.length * 100}%)</h4>
                </div>
            )}

            <StandardTable
                table={table}
                title={''}
                data={tasks}
                pagination={true}
                customHeader={table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className={"p-16"}>
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
