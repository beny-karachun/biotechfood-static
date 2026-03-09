import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          {/* Logo Placeholder (optional in footer) */}
          {/* <span className="font-bold sm:inline-block">TechnionPrep</span> */}
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} TechnionPrep. All rights reserved.
            <br />
            <small>This website is not affiliated with the Technion - Israel Institute of Technology.</small>
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground md:justify-end">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
