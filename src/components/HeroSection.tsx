'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();

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
                ? `${process.env.NODE_ENV === 'production' ? '/biotechfood-static' : ''}/lightmode-ASCII-background-1080p-60fps.mp4`
                : `${process.env.NODE_ENV === 'production' ? '/biotechfood-static' : ''}/darkmode-ASCII-background-1080p-60fps.mp4`
            }
            autoPlay
            loop
            muted
            playsInline // Important for mobile playback
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            Your browser does not support the video tag.
          </video>
        )}
        {/* Removed fallback image for server-side rendering */}

        {/* Overlay - Very subtle to let the ASCII animation shine through */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/20 dark:bg-black/20 z-10"></div>
        {/* Secondary overlay specifically for the right side (dark side) of the video, perfectly aligned with the video's natural split so no gradient blur is needed. */}
        <div className="absolute top-0 right-0 w-[41.5%] h-full bg-black/70 z-10 pointer-events-none"></div>
      </div>

      {/* Text content centered on top */}
      <div className="relative z-20 container text-center px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
          style={{
            color: 'white',
            WebkitTextStroke: '1px rgba(0,0,0,0.4)',
            textShadow: '0px 4px 24px rgba(0,0,0,0.5)'
          }}
        >
          Biotechnology & <br className="hidden md:block" /> Food Engineering
        </h1>
        <p
          className="text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mt-4 mb-8 sm:mt-6 sm:mb-10"
          style={{
            color: 'white',
            WebkitTextStroke: '0.5px rgba(0,0,0,0.4)',
            textShadow: '0px 2px 12px rgba(0,0,0,0.5)'
          }}
        >
          Your Technion B.Sc. course companion. <br className="hidden md:block" />
          Access all study materials, summaries, and tools in one hub.
        </p>
        <div className="flex justify-center">
          {/* Link triggers the client-side scroll function */}
          <a href="#course-diagram" onClick={scrollToDiagram}>
            <Button className="w-full md:w-auto px-10 py-6 text-lg rounded-full shadow-xl transition-transform hover:-translate-y-1" variant="secondary">
              Explore Courses
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
