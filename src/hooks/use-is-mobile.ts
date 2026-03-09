import { useState, useEffect } from 'react';

/**
 * SSR-safe hook to detect mobile viewport.
 * Returns `false` during SSR, then hydrates correctly on the client.
 * Uses matchMedia for reactive updates on resize.
 */
export function useIsMobile(breakpoint = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches);
        };
        // Set initial value
        onChange(mql);
        // Listen for changes
        mql.addEventListener('change', onChange as (e: MediaQueryListEvent) => void);
        return () => mql.removeEventListener('change', onChange as (e: MediaQueryListEvent) => void);
    }, [breakpoint]);

    return isMobile;
}
