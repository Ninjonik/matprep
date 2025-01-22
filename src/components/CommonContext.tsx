'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import SubjectObject from '@/interfaces/SubjectObject';
import TaskObject from '@/interfaces/TaskObject';
import { usePocket } from '@/components/PocketBaseContext';

interface CommonContextProps {
    children: ReactNode;
}

interface CommonContextValue {
    tasks: TaskObject[];
    subjects: SubjectObject[];
}

const CommonContext = createContext<CommonContextValue | undefined>(undefined);

export const useCommonContext = () => {
    const context = useContext(CommonContext);
    if (!context) {
        throw new Error(
            "useCommonContext must be used within a CommonContextProvider",
        );
    }
    return context;
};

export const CommonContextProvider = ({ children }: CommonContextProps) => {

    const [tasks, setTasks] = useState<TaskObject[]>([]);
    const [subjects, setSubjects] = useState<SubjectObject[]>([]);

    const {pb} = usePocket();

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
                expand: 'tasks'
            })) as unknown as SubjectObject[];

            setSubjects(records);
        };

        fetchTasks();
        fetchSubjects();
    }, [pb]);

    return (
        <CommonContext.Provider
            value={{
                tasks,
                subjects
            }}
        >
            {children}
        </CommonContext.Provider>
    );
};
