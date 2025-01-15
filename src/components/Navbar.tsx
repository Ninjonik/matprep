'use client';

import * as React from 'react';

import Link from 'next/link';

import ThemeSwitch from '@/components/ThemeSwitch';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { Menu } from 'lucide-react';

const navigationItems = [
    { title: 'Home', href: '/' },
    {
        title: 'Profil',
        items: [
            { title: 'Prihlásiť sa', href: '/login' },
            { title: 'Registrovať sa', href: '/register' },
            { title: 'Onboarding', href: '/onboarding' }
        ]
    }
];

export function Navbar() {
    return (
        <nav className='h-[7dvh] border-b'>
            <div className='flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
                <div className='text-xl font-semibold'>
                    <Link href='/'>MaturitaPrep 2025</Link>
                </div>
                <MobileNav />
                <DesktopNav />
            </div>
        </nav>
    );
}

function MobileNav() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline' size='icon' className='md:hidden'>
                    <Menu className='size-5' />
                    <span className='sr-only'>Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className={'bg-neutral-200 dark:bg-neutral-800'}>
                <div className='flex flex-col space-y-4'>
                    {navigationItems.map((item) => (
                        <React.Fragment key={item.title}>
                            {item.href ? (
                                <Link href={item.href} className='text-lg font-medium'>
                                    {item.title}
                                </Link>
                            ) : (
                                <>
                                    <h4 className='text-lg font-medium'>{item.title}</h4>
                                    <div className='ml-4 flex flex-col space-y-2'>
                                        {item.items?.map((subItem) => (
                                            <Link key={subItem.title} href={subItem.href} className='text-sm'>
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </React.Fragment>
                    ))}
                    <ThemeSwitch />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function DesktopNav() {
    return (
        <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList className='space-x-2'>
                {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        {item.href ? (
                            <Link href={item.href} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    {item.title}
                                </NavigationMenuLink>
                            </Link>
                        ) : (
                            <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                        )}
                        {item.items && (
                            <NavigationMenuContent>
                                <ul className='grid w-[400px] gap-3 rounded-md bg-popover p-4 text-popover-foreground shadow-md md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]'>
                                    {item.items.map((subItem) => (
                                        <ListItem key={subItem.title} title={subItem.title} href={subItem.href} />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        )}
                    </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                    <ThemeSwitch />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className
                        )}
                        {...props}>
                        <div className='text-sm font-medium leading-none'>{title}</div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = 'ListItem';
