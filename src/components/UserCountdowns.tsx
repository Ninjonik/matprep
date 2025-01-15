'use client';

import React, { useEffect, useState } from 'react';

import { ExamCountdown } from '@/components/ExamCountDown';
import { usePocket } from '@/components/PocketBaseContext';
import SubjectObject from '@/interfaces/SubjectObject';
import { UserObjectSelectedSubjects } from '@/interfaces/UserObject';
import { getDaysUntil } from '@/utils/dateUtils';

const UserCountdowns = () => {
    const { user, pb } = usePocket();

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
            {selectedSubjects.map((subject) => (
                <>
                    {subject.externalDate && (
                        <ExamCountdown
                            key={`ussm_${subject.id}`}
                            examName={subject.title + ' EČ'}
                            daysUntil={getDaysUntil(new Date(subject.externalDate))}
                        />
                    )}
                    {subject.internalDate && (
                        <ExamCountdown
                            key={`ussm_${subject.id}`}
                            examName={subject.title + ' IČ'}
                            daysUntil={getDaysUntil(new Date(subject.internalDate))}
                        />
                    )}
                </>
            ))}
        </div>
    );
};

export default UserCountdowns;
