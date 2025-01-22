import SubjectObject from '@/interfaces/SubjectObject';

export default interface TaskObject {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
    expand: {
        subject: SubjectObject;
    };
    attachments: string[];
}
