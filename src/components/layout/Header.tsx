'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isForcedOpen, setIsForcedOpen] = useState<boolean | null>(null);

  const isEffectivelyExpanded = isForcedOpen ?? !hasScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 1;
      setHasScrolled(scrolled);
      if (window.scrollY === 0) {
        setIsForcedOpen(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = '972546123730';
    const message = encodeURIComponent('היי בני, בנוגע לאתר של ביוטכנולוגיה ומזון,');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const toggleExpand = () => {
    setIsForcedOpen(!isEffectivelyExpanded);
  };

  const collapsedMaxWidthClass = "max-w-10";
  const expandedMaxWidthClass = "max-w-md";

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={cn(
          'flex items-center rounded-md bg-secondary transition-all duration-300 ease-in-out overflow-hidden p-1',
          isEffectivelyExpanded
            ? `${expandedMaxWidthClass} space-x-1`
            : `${collapsedMaxWidthClass}`
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleExpand}
          aria-label={isEffectivelyExpanded ? 'Collapse menu' : 'Expand menu'}
          className={cn(
            "p-1.5 h-auto shrink-0",
            !isEffectivelyExpanded && "w-full"
          )}
        >
          {isEffectivelyExpanded ? (
            <Icons.chevronRight className="h-4 w-4" />
          ) : (
            <Icons.chevronLeft className="h-4 w-4" />
          )}
        </Button>

        <div
          className={cn(
            'flex items-center gap-1 transition-all duration-300 ease-in-out origin-right',
            isEffectivelyExpanded
              ? 'scale-x-100 opacity-100'
              : 'scale-x-0 opacity-0',
          )}
        >
          <nav className="flex flex-shrink-0 items-center gap-1 text-sm whitespace-nowrap">
            {/* --- Home Button --- */}
            <Link
              href="/"
              aria-label="Home"
              tabIndex={isEffectivelyExpanded ? 0 : -1}
              className={cn("inline-flex items-center justify-center rounded-md p-1.5 h-auto hover:bg-accent hover:text-accent-foreground", !isEffectivelyExpanded && 'invisible')}
            >
              <Icons.home className="h-4 w-4" />
            </Link>

            {/* --- Calculator Button --- */}
            <Link
              href="/calculator"
              aria-label="Academic Calculator"
              tabIndex={isEffectivelyExpanded ? 0 : -1}
              className={cn("inline-flex items-center justify-center rounded-md p-1.5 h-auto hover:bg-accent hover:text-accent-foreground", !isEffectivelyExpanded && 'invisible')}
            >
              <Icons.calculator className="h-4 w-4" />
            </Link>

            {/* --- WhatsApp Button --- */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWhatsAppClick}
              aria-label="Contact via WhatsApp"
              className={cn("p-1.5 h-auto", !isEffectivelyExpanded && 'invisible')}
              tabIndex={isEffectivelyExpanded ? 0 : -1}
            >
              <Icons.whatsapp className="h-4 w-4" />
            </Button>

            {/* --- Theme Toggle Button --- */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
              className={cn("p-1.5 h-auto relative", !isEffectivelyExpanded && 'invisible')}
              tabIndex={isEffectivelyExpanded ? 0 : -1}
            >
              <Icons.light className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icons.dark className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
