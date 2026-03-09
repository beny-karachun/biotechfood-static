'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

  const collapsedMaxWidthClass = "max-w-12";
  const expandedMaxWidthClass = "max-w-md";

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={cn(
          'flex items-center rounded-full bg-secondary/60 backdrop-blur-md border border-border/50 shadow-lg transition-all duration-500 ease-in-out overflow-hidden p-1.5',
          isEffectivelyExpanded
            ? `${expandedMaxWidthClass} space-x-2`
            : `${collapsedMaxWidthClass}`
        )}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpand}
            aria-label={isEffectivelyExpanded ? 'Collapse menu' : 'Expand menu'}
            className={cn(
              "p-2 h-auto shrink-0 rounded-full hover:bg-white/20 dark:hover:bg-black/20 min-w-[44px] min-h-[44px] flex items-center justify-center",
              !isEffectivelyExpanded && "w-full"
            )}
          >
            {isEffectivelyExpanded ? (
              <Icons.chevronRight className="h-4 w-4" />
            ) : (
              <Icons.chevronLeft className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        <div
          className={cn(
            'flex items-center gap-2 transition-all duration-500 ease-in-out origin-right',
            isEffectivelyExpanded
              ? 'scale-x-100 opacity-100 translate-x-0'
              : 'scale-x-0 opacity-0 translate-x-4',
          )}
        >
          <nav className="flex flex-shrink-0 items-center gap-2 text-sm whitespace-nowrap pl-2">
            {/* --- Home Button --- */}
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/"
                aria-label="Home"
                tabIndex={isEffectivelyExpanded ? 0 : -1}
                className={cn("inline-flex items-center justify-center rounded-full p-2 h-auto min-w-[44px] min-h-[44px] hover:bg-white/20 dark:hover:bg-black/20 hover:text-accent-foreground transition-colors", !isEffectivelyExpanded && 'invisible')}
              >
                <Icons.home className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* --- Calculator Button --- */}
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/calculator"
                aria-label="Academic Calculator"
                tabIndex={isEffectivelyExpanded ? 0 : -1}
                className={cn("inline-flex items-center justify-center rounded-full p-2 h-auto min-w-[44px] min-h-[44px] hover:bg-white/20 dark:hover:bg-black/20 hover:text-accent-foreground transition-colors", !isEffectivelyExpanded && 'invisible')}
              >
                <Icons.calculator className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* --- WhatsApp Button --- */}
            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWhatsAppClick}
                aria-label="Contact via WhatsApp"
                className={cn("p-2 rounded-full h-auto min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/20 dark:hover:bg-black/20 transition-colors", !isEffectivelyExpanded && 'invisible')}
                tabIndex={isEffectivelyExpanded ? 0 : -1}
              >
                <Icons.whatsapp className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* --- Theme Toggle Button --- */}
            <motion.div whileHover={{ scale: 1.15, rotate: 15 }} whileTap={{ scale: 0.9, rotate: -15 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label="Toggle theme"
                className={cn("p-2 rounded-full h-auto relative min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/20 dark:hover:bg-black/20 transition-colors", !isEffectivelyExpanded && 'invisible')}
                tabIndex={isEffectivelyExpanded ? 0 : -1}
              >
                <Icons.light className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Icons.dark className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>
          </nav>
        </div>
      </div>
    </div>
  );
}
