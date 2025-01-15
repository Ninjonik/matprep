'use client';

import { useEffect, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import TaskObject from '@/interfaces/TaskObject';

import PocketBase from 'pocketbase';

export function TaskList() {
    const [tasks, setTasks] = useState<TaskObject[]>([]);

    const toggleTask = (id: string) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    };

    useEffect(() => {
        const fetchData = async () => {
            const pb = new PocketBase('https://pb.igportals.eu');

            const records = (await pb.collection('tasks').getFullList({
                sort: '-subject',
                expand: 'subject'
            })) as unknown as TaskObject[];

            console.log(records);

            setTasks(records);
        };

        fetchData();
    }, []);

    return (
        <div className='space-y-4'>
            <ul className='space-y-2'>
                {tasks.map((task) => (
                    <li key={task.id} className='flex items-center space-x-2'>
                        <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                        <label
                            htmlFor={task.id}
                            className={`flex-grow ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
                            {task.expand.subject.title} | {task.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}
