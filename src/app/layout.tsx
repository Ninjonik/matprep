import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { Navbar } from '@/components/Navbar';
import { PocketProvider } from '@/components/PocketBaseContext';

import { ToastContainer } from 'react-toastify';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

export const metadata: Metadata = {
    title: 'Maturita Prep 2025',
    description: 'Pripravte sa na Maturitu 2025 s jasným dopamínovým bonusom zadarmo!'
};

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html suppressHydrationWarning lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col justify-stretch overflow-x-hidden bg-background text-foreground antialiased`}>
                <ThemeProvider attribute='class'>
                    <ToastContainer />
                    <PocketProvider>
                        <Navbar />
                        <section className={'flex h-full w-screen items-stretch justify-stretch'}>{children}</section>
                        {/*                        <footer className='mt-auto h-[5dvh] border-t py-4 text-center text-sm text-muted-foreground'>
                            &copy; 2023 Student Dashboard. All rights reserved.
                        </footer>*/}
                    </PocketProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default Layout;
