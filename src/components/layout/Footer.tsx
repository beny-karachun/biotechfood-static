'use client';

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-auto md:flex-row md:py-8">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} {t('footer.rights')}
            <br />
            <small>{t('footer.disclaimer')}</small>
          </p>
        </div>

        {/* Creator Credits */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {t('footer.built_by')} <span className="font-medium text-foreground">Beny Karachun</span>
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com/in/beny-karachun-5a5188369/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/beny-karachun"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.github className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/972546123730"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.whatsapp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground md:justify-end">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            {t('footer.terms')}
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            {t('footer.privacy')}
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            {t('footer.contact')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
