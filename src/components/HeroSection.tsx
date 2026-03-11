'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/use-is-mobile';

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to handle smooth scrolling
  const scrollToDiagram = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault(); // Prevent default anchor link behavior
    const diagramSection = document.getElementById('course-diagram');
    if (diagramSection) {
      diagramSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-center justify-center w-full h-screen min-h-[500px] md:min-h-[600px] overflow-hidden text-slate-900 dark:text-white">
      {/* Background Video Container */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Only render video on the client to avoid hydration mismatch, and because theme is client-side */}
        {isClient && (
          <video
            // Re-render video element when src changes using relative paths
            key={resolvedTheme === 'light' ? 'light-video' : 'dark-video'}
            src={
              resolvedTheme === 'light'
                ? `/lightmode-ASCII-background-1080p-60fps.mp4`
                : `/darkmode-ASCII-background-1080p-60fps.mp4`
            }
            autoPlay
            loop
            muted
            playsInline // Important for mobile playback
            className="absolute top-0 left-0 w-full h-full object-cover z-0 object-[65%_center] md:object-center contrast-[1.6] saturate-[1.4]"
          >
            Your browser does not support the video tag.
          </video>
        )}
        {/* Removed fallback image for server-side rendering */}

        {/* Overlay - multiply blend deepens blacks without washing out colors in both themes */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/25 mix-blend-multiply z-10"></div>
        {/* Secondary overlay for the right side — multiply blend makes the dark side blacker while keeping bright elements vibrant. Hidden on mobile. */}
        <div className="hidden md:block absolute top-0 right-0 w-[41.5%] h-full bg-black/30 mix-blend-multiply z-10 pointer-events-none"></div>
      </div>

      {/* Text content centered on top */}
      <div className="relative z-20 container text-center px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
          style={{
            color: 'white',
            ...(isMobile ? {} : { WebkitTextStroke: '1px rgba(0,0,0,0.4)' }),
            textShadow: '0px 4px 24px rgba(0,0,0,0.5)'
          }}
        >
          Biotechnology & <br className="hidden md:block" /> Food Engineering
        </h1>
        <p
          className="text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mt-4 mb-8 sm:mt-6 sm:mb-10"
          style={{
            color: 'white',
            ...(isMobile ? {} : { WebkitTextStroke: '0.5px rgba(0,0,0,0.4)' }),
            textShadow: '0px 2px 12px rgba(0,0,0,0.5)'
          }}
        >
          Your Technion B.Sc. course companion. <br className="hidden md:block" />
          Access all study materials, summaries, and tools in one hub.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Link triggers the client-side scroll function */}
          <a href="#course-diagram" onClick={scrollToDiagram}>
            <Button className="w-full md:w-auto min-w-[220px] px-10 py-6 text-lg rounded-full shadow-xl transition-transform hover:-translate-y-1" variant="secondary">
              Explore Courses
            </Button>
          </a>
          <Link href="/tutoring">
            <Button className="w-full md:w-auto min-w-[220px] px-10 py-6 text-lg rounded-full shadow-xl transition-transform hover:-translate-y-1" variant="secondary">
              Arrange Tutoring
            </Button>
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <a
            href="https://www.linkedin.com/in/beny-karachun-5a5188369/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-white hover:scale-110 transition-all duration-200"
          >
            <Icons.linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/beny-karachun"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-white hover:scale-110 transition-all duration-200"
          >
            <Icons.github className="h-5 w-5" />
          </a>
          <a
            href="https://wa.me/972546123730"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-white hover:scale-110 transition-all duration-200"
          >
            <Icons.whatsapp className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
