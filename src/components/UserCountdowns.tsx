'use client';

import { useEffect, useState } from 'react';

import { ExamCountdown } from '@/components/ExamCountDown';
import { usePocket } from '@/components/PocketBaseContext';
import SubjectObject from '@/interfaces/SubjectObject';
import { UserObjectSelectedSubjects } from '@/interfaces/UserObject';
import { useCommonContext } from '@/components/CommonContext';

const UserCountdowns = () => {
    const { user, pb } = usePocket();
    const {tasks} = useCommonContext();

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

    return (
        <div className='mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {tasks &&
                tasks.length > 0 &&
                selectedSubjects.map((subject) => (
                    <ExamCountdown key={`ussm_${subject.id}`} subject={subject} allTasks={tasks} />
                ))}
        </div>
    );
};

export default UserCountdowns;
