import TaskList from '@/components/TaskList';
import UserCountdowns from '@/components/UserCountdowns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentWeek, getDaysUntil } from '@/utils/dateUtils';

export default function Home() {
    const currentWeek = getCurrentWeek();
    const daysUntilExam1 = getDaysUntil(new Date('2025-03-11'));
    const daysUntilExam2 = getDaysUntil(new Date('2025-05-22'));

    return (
        <div className='h-max w-full bg-background'>
            <main className='container mx-auto w-full px-4 py-8'>
                <h1 className='mb-8 text-4xl font-bold'>{currentWeek}. Týždeň</h1>
                <UserCountdowns />
                <Card>
                    <CardHeader>
                        <CardTitle>Témy na tento týždeň</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskList />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
