'use client';

import React, { useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { usePocket } from '@/components/PocketBaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import fireToast from '@/utils/fireToast';

export default function LoginPage() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { register, login } = usePocket();
    const router = useRouter();

    const handleOnSubmit = async (evt: React.FormEvent) => {
        evt?.preventDefault();
        if (!emailRef.current?.value || !passwordRef?.current?.value) return;
        const logRes = await login(emailRef.current.value, passwordRef.current.value);
        if (logRes) {
            fireToast('success', 'Úspešne prihlásený!');

            return router.push('/onboarding');
        }
        console.error(logRes);
        fireToast('error', 'Neplatné prihlasovacie údaje.');
    };

    return (
        <form className='flex h-full grow items-center justify-center bg-gray-100' onSubmit={handleOnSubmit}>
            <Card className='w-[350px]'>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        <div className='grid w-full items-center gap-4'>
                            <div className='flex flex-col space-y-1.5'>
                                <Input ref={emailRef} id='email' placeholder='Email' type='email' />
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Input ref={passwordRef} id='password' placeholder='Password' type='password' />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col'>
                    <Button className='w-full' type={'submit'}>
                        Login
                    </Button>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Don't have an account?{' '}
                        <Link href='/register' className='text-blue-600 hover:underline'>
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </form>
    );
}
