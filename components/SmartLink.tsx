'use client';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { noAnim?: boolean };

export default function SmartLink({ href, children, onClick, noAnim, ...rest }: Props){
  const pathname = usePathname();
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
    const target = typeof href === 'string' ? href : href || '/';
    if (noAnim || target === pathname) return; // skip anim
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('route:go', { detail: { href: target } }));
  };
  return <Link href={href} onClick={handle} {...rest}>{children}</Link>;
}
