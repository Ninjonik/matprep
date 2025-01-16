'use client';

import React, { useRef } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { usePocket } from '@/components/PocketBaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import fireToast from '@/utils/fireToast';

export default function RegisterPage() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { register, login } = usePocket();
    const router = useRouter();

    const handleOnSubmit = async (evt: React.FormEvent) => {
        evt?.preventDefault();
        if (!emailRef.current?.value || !passwordRef?.current?.value) return;
        const regRes = await register(emailRef.current.value, passwordRef.current.value);
        if (regRes) {
            await login(emailRef.current.value, passwordRef.current.value);
            fireToast('success', 'Úspešne zaregistrovaný!');

            return router.push('/settings');
        }
        console.error(regRes);
        fireToast('error', 'Pri registrácii nastala chyba, kontaktujte prosím administrátora.');
    };

    return (
        <form
            className='flex h-full grow items-center justify-center bg-gray-100 dark:bg-gray-800'
            onSubmit={handleOnSubmit}>
            <Card className='w-[350px]'>
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        <div className='grid w-full items-center gap-4'>
                            <div className='flex flex-col space-y-1.5'>
                                <Input id='email' placeholder='Email' type='email' ref={emailRef} />
                            </div>
                            <div className='flex flex-col space-y-1.5'>
                                <Input id='password' placeholder='Password' type='password' ref={passwordRef} />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex flex-col'>
                    <Button className='w-full' type={'submit'}>
                        Register
                    </Button>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Already have an account?{' '}
                        <Link href='/login' className='text-blue-600 hover:underline'>
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </form>
    );
}
