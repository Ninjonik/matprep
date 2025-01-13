'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVIGATION_LINKS = [
    { href: '/', label: 'Domov' },
    { href: '/examples', label: 'Examples' }
];

const NavigationLinks = () => {
    const pathname = usePathname();

    return (
        <div className='flex items-center gap-3'>
            {NAVIGATION_LINKS.map((link) => {
                const active = link.href === '/' ? pathname === link.href : pathname.includes(link.href);

                return (
                    <Link key={link.href} href={link.href}>
                        <button
                            className={`${active ? 'bg-neutral-200 dark:bg-neutral-700' : 'bg-transparent'} rounded-xl px-3 py-2`}>
                            {link.label}
                        </button>
                    </Link>
                );
            })}
        </div>
    );
};

export default NavigationLinks;