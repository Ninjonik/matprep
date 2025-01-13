import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExamCountdownProps {
    examName: string;
    daysUntil: number;
}

export function ExamCountdown({ examName, daysUntil }: ExamCountdownProps) {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Days until {examName}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{daysUntil}</div>
            </CardContent>
        </Card>
    );
}
