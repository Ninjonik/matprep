'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { usePocket } from '@/components/PocketBaseContext';
import TasksTable from '@/components/TasksTable';
import { Button, buttonVariants } from '@/components/ui/button';
import SubjectObject from '@/interfaces/SubjectObject';
import TaskObject from '@/interfaces/TaskObject';
import fireToast from '@/utils/fireToast';

export default function TaskList() {
    const { pb, user } = usePocket();

    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<SubjectObject[]>([]);
    const [tasks, setTasks] = useState<TaskObject[]>([]);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    useEffect(() => {
        setFilteredSubjects(selectedSubjects);
    }, [selectedSubjects]);

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

    useEffect(() => {
        setSelectedSubjects(user?.selectedSubjects || []);
        setSelectedTasks(user?.selectedTasks || []);
        setCompletedTasks(user?.completedTasks || []);
    }, [user]);

    const saveSelectedTasks = async () => {
        if (!user) return;
        const record = await pb.collection('users').update(user.id, { completedTasks: completedTasks });
        fireToast('success', 'Dokončené témy boli úspešne uložené.');
    };

    return (
        <div className='container mx-auto flex w-full flex-col gap-4 p-4'>
            {selectedSubjects?.length > 0 ? (
                <div className={'relative'}>
                    <Button className={'absolute right-0 top-0 w-32 place-self-end'} onClick={saveSelectedTasks}>
                        Uložiť
                    </Button>
                </div>
            ) : (
                <div className={'w-full'}>
                    <h2>
                        Pre používanie aplikácie sa prosím{' '}
                        <Link className={buttonVariants({ variant: 'outline' })} href={'/login'}>
                            prihláste
                        </Link>{' '}
                        alebo{' '}
                        <Link className={buttonVariants({ variant: 'outline' })} href={'/register'}>
                            zaregistrujte
                        </Link>
                    </h2>
                </div>
            )}
            {selectedSubjects?.length > 0 && (
                <TasksTable
                    filteredSubjects={filteredSubjects}
                    setFilteredSubjects={setFilteredSubjects}
                    selectedSubjects={selectedSubjects}
                    selectedTasks={selectedTasks}
                    setSelectedTasks={setSelectedTasks}
                    subjects={subjects}
                    tasks={tasks}
                    page={'index'}
                    completedTasks={completedTasks}
                    setCompletedTasks={setCompletedTasks}
                />
            )}
        </div>
    );
}
