'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import { Plus } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

const initialTasks: Task[] = [
    { id: '1', title: 'Complete TypeScript assignment', completed: false },
    { id: '2', title: 'Read React documentation', completed: true },
    { id: '3', title: 'Buy groceries', completed: false },
    { id: '4', title: 'Prepare for next exam', completed: false },
    { id: '5', title: 'Clean the house', completed: true }
];

export function TaskList() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [newTask, setNewTask] = useState('');

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, { id: Date.now().toString(), title: newTask, completed: false }]);
            setNewTask('');
        }
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    };

    return (
        <div className='space-y-4'>
            <div className='flex space-x-2'>
                <Input
                    type='text'
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder='Add a new task'
                    className='flex-grow'
                />
                <Button onClick={addTask}>
                    <Plus className='mr-2 size-4' /> Add Task
                </Button>
            </div>
            <ul className='space-y-2'>
                {tasks.map((task) => (
                    <li key={task.id} className='flex items-center space-x-2'>
                        <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                        <label
                            htmlFor={task.id}
                            className={`flex-grow ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
                            {task.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}
