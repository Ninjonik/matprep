'use client';

import { useEffect, useState } from 'react';

import { usePocket } from '@/components/PocketBaseContext';
import TasksTable from '@/components/TasksTable';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import fireToast from '@/utils/fireToast';
import { useCommonContext } from '@/components/CommonContext';

export default function Page() {
    const { pb, user } = usePocket();

    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);

    const {tasks, subjects} = useCommonContext();

    const handleSubjectToggle = (subjectId: string) => {
        setSelectedSubjects((prev) => {
            const newSelectedSubjects = prev.includes(subjectId)
                ? prev.filter((id) => id !== subjectId)
                : [...prev, subjectId];
            setSelectedTasks(
                tasks
                    .filter((task) => newSelectedSubjects.some((s) => s === task.expand.subject.id))
                    .map((task) => task.id)
            );

            return newSelectedSubjects;
        });
    };

    useEffect(() => {
        setFilteredSubjects(selectedSubjects);
    }, [selectedSubjects]);

    useEffect(() => {
        setSelectedSubjects(user?.selectedSubjects || []);
        setSelectedTasks(user?.selectedTasks || []);
    }, [user]);

    console.log(selectedTasks);

    const handleSave = async () => {
        if (!user) return fireToast('error', 'Pre úpravu vybraných predmetov/tém musíte byť prihlásení!');
        const record = await pb
            .collection('users')
            .update(user.id, { selectedSubjects: selectedSubjects, selectedTasks: selectedTasks });
        fireToast('success', 'Vybrané predmety/témy úspešne aktualizované!');
    };

    return (
        <div className='container mx-auto flex w-full flex-col gap-4 p-4'>
            <h1 className='mb-4 text-2xl font-bold'>Nastavenia</h1>

            <div className={'mb-8 flex flex-row justify-between'}>
                <div className=''>
                    <h2 className='mb-2 text-xl font-semibold'>1. Vyber predmety</h2>
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
                {selectedSubjects.length > 0 && (
                    <Button onClick={handleSave} className={'w-32 place-self-end'}>
                        Uložiť
                    </Button>
                )}
            </div>

            {selectedSubjects?.length > 0 && (
                <TasksTable
                    filteredSubjects={filteredSubjects}
                    setFilteredSubjects={setFilteredSubjects}
                    selectedSubjects={selectedSubjects}
                    selectedTasks={selectedTasks}
                    setSelectedTasks={setSelectedTasks}
                    subjects={subjects}
                    tasks={tasks}
                />
            )}
        </div>
    );
}
