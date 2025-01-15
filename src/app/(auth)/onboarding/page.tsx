'use client';

import React, { useEffect, useState } from 'react';

import { usePocket } from '@/components/PocketBaseContext';
import { Filter, StandardTable } from '@/components/StandardTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

export default function OnboardingPage() {
    const { pb, user } = usePocket();

    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<SubjectObject[]>([]);
    const [tasks, setTasks] = useState<TaskObject[]>([]);

    const rerender = React.useReducer(() => ({}), {})[1];
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const handleSubjectToggle = (subjectId: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
        );
    };

    const handleTaskToggle = (taskId: string) => {
        setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]));
    };

    useEffect(() => {
        const fetchTasks = async () => {
            const records = (await pb.collection('tasks').getFullList({
                sort: '-subject',
                expand: 'subject'
            })) as unknown as TaskObject[];

            setTasks(records);
        };

        const fetchSubjects = async () => {
            const records = (await pb.collection('subjects').getFullList({
                sort: '-id'
            })) as unknown as SubjectObject[];

            setSubjects(records);
        };

        fetchSubjects();
        fetchTasks();
    }, []);

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
            header: () => <span className={'flex items-center justify-center'}>Zahrnúť?</span>
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
                if ((!filterValue && filterValue !== 0) || filterValue === '') return true;

                return row.original.expand.subject.id === filterValue;
            },
            meta: {
                filterVariant: 'select'
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

    const handleSave = () => {
        console.log('Selected Subjects:', selectedSubjects);
        console.log('Selected Tasks:', selectedTasks);
        // Here you would typically send this data to your backend
    };

    return (
        <div className='container mx-auto w-full p-4'>
            <h1 className='mb-4 text-2xl font-bold'>Onboarding</h1>

            <div className='mb-8'>
                <h2 className='mb-2 text-xl font-semibold'>Vyber predmety</h2>
                <div className='flex flex-wrap gap-4'>
                    {subjects.map((subject) => (
                        <div key={subject.id} className='flex items-center space-x-2'>
                            <Checkbox
                                id={`subject-${subject.id}`}
                                checked={selectedSubjects.includes(subject.id)}
                                onCheckedChange={() => handleSubjectToggle(subject.id)}
                            />
                            <label htmlFor={`subject-${subject.id}`}>{subject.title}</label>
                        </div>
                    ))}
                </div>
            </div>

            <StandardTable
                table={table}
                title={'Témy'}
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
                                                    select={
                                                        <select
                                                            onChange={(e) =>
                                                                header.column.setFilterValue(parseInt(e.target.value))
                                                            }
                                                            value={header.column.getFilterValue()?.toString()}
                                                            className={'select select-xs mt-2'}>
                                                            <option value=''>Všetky</option>
                                                            {subjects.map((subject, index) => (
                                                                <option
                                                                    key={'statuses_map_orders_' + index}
                                                                    value={index}>
                                                                    {subject.title}
                                                                </option>
                                                            ))}
                                                        </select>
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

            {selectedSubjects.length > 0 && <Button onClick={handleSave}>Save Preferences</Button>}
        </div>
    );
}
