'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';

const navItemVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: 20,
    scale: 0.6,
    filter: 'blur(4px)',
    transition: {
      delay: i * 0.04,
      duration: 0.2,
      ease: 'easeIn' as const,
    },
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.06,
      type: 'spring' as const,
      stiffness: 400,
      damping: 22,
      mass: 0.8,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: 15,
    scale: 0.6,
    filter: 'blur(4px)',
    transition: {
      delay: (5 - i) * 0.03,
      duration: 0.15,
      ease: 'easeIn' as const,
    },
  }),
};

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
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

  const navItems = [
    {
      key: 'home',
      content: (
        <Link
          href="/"
          aria-label={t('nav.home')}
          tabIndex={isEffectivelyExpanded ? 0 : -1}
          className="inline-flex items-center justify-center rounded-full p-2 h-auto min-w-[44px] min-h-[44px] hover:bg-white/20 dark:hover:bg-black/20 hover:text-accent-foreground transition-colors"
        >
          <Icons.home className="h-4 w-4" />
        </Link>
      ),
    },
    {
      key: 'calculator',
      content: (
        <Link
          href="/calculator"
          aria-label={t('nav.calculator')}
          tabIndex={isEffectivelyExpanded ? 0 : -1}
          className="inline-flex items-center justify-center rounded-full p-2 h-auto min-w-[44px] min-h-[44px] hover:bg-white/20 dark:hover:bg-black/20 hover:text-accent-foreground transition-colors"
        >
          <Icons.calculator className="h-4 w-4" />
        </Link>
      ),
    },
    {
      key: 'tutoring',
      content: (
        <Link
          href="/tutoring"
          aria-label={t('nav.tutoring')}
          tabIndex={isEffectivelyExpanded ? 0 : -1}
          className="inline-flex items-center justify-center rounded-full p-2 h-auto min-w-[44px] min-h-[44px] hover:bg-white/20 dark:hover:bg-black/20 hover:text-accent-foreground transition-colors"
        >
          <Icons.messageSquare className="h-4 w-4" />
        </Link>
      ),
    },
    {
      key: 'whatsapp',
      content: (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWhatsAppClick}
          aria-label={t('nav.whatsapp')}
          className="p-2 rounded-full h-auto min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
          tabIndex={isEffectivelyExpanded ? 0 : -1}
        >
          <Icons.whatsapp className="h-4 w-4" />
        </Button>
      ),
    },
    {
      key: 'theme',
      content: (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={t('nav.theme')}
          className="p-2 rounded-full h-auto min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
          tabIndex={isEffectivelyExpanded ? 0 : -1}
        >
          <Icons.light className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.dark className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      ),
      hoverRotate: true,
    },
    {
      key: 'language',
      content: (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
          aria-label={t('nav.language')}
          className="p-2 rounded-full h-auto min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
          tabIndex={isEffectivelyExpanded ? 0 : -1}
        >
          <Icons.globe className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
      <div className="fixed top-4 right-4 z-50" dir="ltr">
        <motion.div
          layout
          transition={{
            layout: { type: 'spring', stiffness: 350, damping: 30, mass: 0.8 },
          }}
          className="flex items-center rounded-full bg-secondary/60 backdrop-blur-md border border-border/50 shadow-lg overflow-hidden p-1.5"
        >
          {/* --- Chevron Toggle --- */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="shrink-0"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpand}
              aria-label={isEffectivelyExpanded ? 'Collapse menu' : 'Expand menu'}
              className="p-2 h-auto shrink-0 rounded-full hover:bg-white/20 dark:hover:bg-black/20 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: isEffectivelyExpanded ? 0 : 180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icons.chevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>

          {/* --- Nav Items --- */}
          <AnimatePresence mode="popLayout">
            {isEffectivelyExpanded && (
              <motion.nav
                className="flex items-center gap-1 text-sm whitespace-nowrap pl-1 overflow-hidden"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
              >
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.key}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={item.hoverRotate ? { scale: 1.15, rotate: 15 } : { scale: 1.15 }}
                    whileTap={item.hoverRotate ? { scale: 0.9, rotate: -15 } : { scale: 0.9 }}
                  >
                    {item.content}
                  </motion.div>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
  );
}
