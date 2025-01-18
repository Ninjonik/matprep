import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubjectObject from '@/interfaces/SubjectObject';
import TaskObject from '@/interfaces/TaskObject';
import { getDaysUntil } from '@/utils/dateUtils';

import { usePocket } from './PocketBaseContext';

interface ExamCountdownProps {
    subject: SubjectObject;
    allTasks: TaskObject[];
}

export function ExamCountdown({ subject, allTasks }: ExamCountdownProps) {
    const [tasks, setTasks] = useState<string[]>([]);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const { user, pb } = usePocket();
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            const selectedTasks = allTasks
                .filter((task) => task.expand.subject.id === subject.id && user.selectedTasks.includes(task.id))
                .map((task) => task.id);
            setTasks(selectedTasks);
            setCompletedTasks(selectedTasks.filter((task) => user.completedTasks.includes(task)));
        };

        if (!user || !subject) return;

        fetchUserData();
    }, [user, subject]);

    if (!subject) return;

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{subject.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {subject?.externalDate && (
                    <div className='text-2xl font-bold'>
                        EČ: {new Date(subject.externalDate).toLocaleDateString('sk-SK')} (o{' '}
                        {getDaysUntil(new Date(subject.externalDate))} dní)
                    </div>
                )}
                {subject?.internalDate && (
                    <div className='text-2xl font-bold'>
                        IČ: {new Date(subject.internalDate).toLocaleDateString('sk-SK')} (o{' '}
                        {getDaysUntil(new Date(subject.internalDate))} dní)
                    </div>
                )}
                <div>
                    {completedTasks.length}/{tasks.length ?? 0} (
                    {(completedTasks.length / (tasks.length === 0 ? 1 : tasks.length)) * 100}%)
                </div>
            </CardContent>
        </Card>
    );
}
