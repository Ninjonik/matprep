import { Metadata } from 'next';
import Link from 'next/link';

import { Announcement } from '@/components/announcement';
import { ExamplesNav } from '@/components/examples-nav';
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Button, buttonVariants } from '@/registry/new-york/ui/button';

export const metadata: Metadata = {
    title: 'Examples',
    description: 'Check out some examples app built using the components.'
};

interface ExamplesLayoutProps {
    children: React.ReactNode;
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
    return (
        <div className='container relative mx-auto mb-12'>
            <PageHeader>
                <Announcement />
                <PageHeaderHeading className='hidden md:block'>Check out some examples</PageHeaderHeading>
                <PageHeaderHeading className='md:hidden'>Examples</PageHeaderHeading>
                <PageHeaderDescription>
                    Dashboard, cards, authentication. Some examples built using the components. Use this as a guide to
                    build your own.
                </PageHeaderDescription>
                <PageActions>
                    <Button asChild size='sm'>
                        <Link href='/docs'>Get Started</Link>
                    </Button>
                    <Button asChild size='sm' variant='ghost'>
                        <Link href='/components'>Components</Link>
                    </Button>
                </PageActions>
            </PageHeader>
            <section>
                <ExamplesNav />
                <div className='bg-background overflow-hidden rounded-[0.5rem] border shadow'>{children}</div>
            </section>
        </div>
    );
}
