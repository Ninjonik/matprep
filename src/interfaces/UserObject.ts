import SubjectObject from '@/interfaces/SubjectObject';

export default interface UserObject {
    avatar?: string;
    collectionId: string;
    collectionName: string;
    selectedTasks: string[];
    completedTasks: string[];
    selectedSubjects: string[];
    completedSubjects: string[];
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

export interface UserObjectSelectedSubjects extends UserObject {
    expand: {
        selectedSubjects: SubjectObject[];
    };
}
