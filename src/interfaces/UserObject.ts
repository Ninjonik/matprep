import TaskObject from '@/interfaces/TaskObject';

interface UserObject {
    avatar?: string;
    collectionId: string;
    collectionName: string;
    selectedTasks: TaskObject[];
    completedTasks: string[];
    created: string;
    email: string;
    emailVisibility: boolean;
    id: string;
    name?: string;
    subjects: any[];
    updated: string;
    username: string;
    verified: boolean;
}
