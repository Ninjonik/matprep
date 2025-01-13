import { ExamCountdown } from '@/components/ExamCountDown';
import { Navbar } from '@/components/Navbar';
import { TaskList } from '@/components/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentWeek, getDaysUntil } from '@/utils/dateUtils';

export default function Home() {
    const currentWeek = getCurrentWeek();
    const daysUntilExam1 = getDaysUntil(new Date('2025-03-11')); // Example date for Exam 1
    const daysUntilExam2 = getDaysUntil(new Date('2025-05-22')); // Example date for Exam 2

    return (
        <div className='min-h-screen bg-background'>
            <Navbar />
            <main className='container mx-auto px-4 py-8'>
                <h1 className='mb-8 text-4xl font-bold'>Week {currentWeek}</h1>
                <div className='mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <ExamCountdown examName='Maturita - Externá časť (testy + slohy)' daysUntil={daysUntilExam1} />
                    <ExamCountdown examName='Maturita - Interná časť (ústna)' daysUntil={daysUntilExam2} />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Tasks for This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskList />
                    </CardContent>
                </Card>
            </main>
            <footer className='border-t py-4 text-center text-sm text-muted-foreground'>
                &copy; 2023 Student Dashboard. All rights reserved.
            </footer>
        </div>
    );
}
