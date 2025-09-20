'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ProjectReveals(){
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.proj'));
    // when ele scrolled into view
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          // if ele has img tag w class "wash-img", add reveal class for anim
          const img = (e.target as HTMLElement).querySelector('img.wash-img');
          if (img) img.classList.add('reveal');
          // stop observing after first reveal
          io.unobserve(e.target);
        }
      });
    }, 
    
    //trigger slightly before leaving view port, until < 1% ele visible
    { rootMargin: '0px 0px -5% 0px', threshold: 0.01 });

    // loop thru each
    els.forEach(el => {
      // reset classes to ensure animation restarts correctly on route change
      el.classList.remove('revealed');
      const img = el.querySelector('img.wash-img');
      if (img) img.classList.remove('reveal');
      io.observe(el);
      // handle elements alr visible on page load (no scroll yet)
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        // reveal
        el.classList.add('revealed');
        if (img) img.classList.add('reveal');
        // stop we're done
        io.unobserve(el);
      }
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
