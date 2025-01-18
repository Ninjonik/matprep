'use client';

import { useEffect, useState } from 'react';

import { ExamCountdown } from '@/components/ExamCountDown';
import { usePocket } from '@/components/PocketBaseContext';
import SubjectObject from '@/interfaces/SubjectObject';
import TaskObject from '@/interfaces/TaskObject';
import { UserObjectSelectedSubjects } from '@/interfaces/UserObject';

const UserCountdowns = () => {
    const { user, pb } = usePocket();
    const [allTasks, setAllTasks] = useState<TaskObject[]>([]);

    const [selectedSubjects, setSelectedSubjects] = useState<SubjectObject[]>([]);
    useEffect(() => {
        const fetchSelectedSubjects = async () => {
            if (!user) return;
            const record = (await pb.collection('users').getFirstListItem(`id="${user.id}"`, {
                expand: 'selectedSubjects'
            })) as UserObjectSelectedSubjects;
            setSelectedSubjects(record.expand.selectedSubjects);
        };
        fetchSelectedSubjects();
    }, [user?.selectedSubjects]);

    useEffect(() => {
        const fetchTasks = async () => {
            const records = (await pb.collection('tasks').getFullList({
                sort: '-subject',
                expand: 'subject'
            })) as unknown as TaskObject[];

            setAllTasks(records);
        };
        fetchTasks();
    }, []);

    console.log(allTasks);

    return (
        <div className='mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {allTasks &&
                allTasks.length > 0 &&
                selectedSubjects.map((subject) => (
                    <ExamCountdown key={`ussm_${subject.id}`} subject={subject} allTasks={allTasks} />
                ))}
        </div>
    );
};

export default UserCountdowns;
