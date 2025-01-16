import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubjectObject from '@/interfaces/SubjectObject';
import { getDaysUntil } from '@/utils/dateUtils';
import { useEffect, useState } from 'react';
import { usePocket } from './PocketBaseContext';

interface ExamCountdownProps {
    subject: SubjectObject;
}

export function ExamCountdown({ subject }: ExamCountdownProps) {
    const [tasks, setTasks] = useState<string[]>([]);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const { user } = usePocket();
    useEffect(() => {
        const fetchUserData = async () => {
            // TODO: finish this
        }

        if(!user || !subject) return;

        fetchUserData();
    }, [user, subject])

    if(!subject) return;

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{subject.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {subject?.externalDate && (
                    <div className='text-2xl font-bold'>EČ: {new Date(subject.externalDate).toLocaleDateString('sk-SK')} (o {getDaysUntil(new Date(subject.externalDate))} dní)</div>
                )}
                 {subject?.internalDate && (
                    <div className='text-2xl font-bold'>IČ: {new Date(subject.internalDate).toLocaleDateString('sk-SK')} (o {getDaysUntil(new Date(subject.internalDate))} dní)</div>
                )}
                <div></div>
            </CardContent>
        </Card>
    );
}
