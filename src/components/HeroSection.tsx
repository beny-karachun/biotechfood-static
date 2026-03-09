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
        {/* Secondary overlay specifically for the right side (dark side) of the video. Gradient starts from right, fades to transparent at 40% of the screen width (from right) */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-black/80 via-black/40 via-[20%] to-transparent to-[40%] z-10 pointer-events-none"></div>
      </div>

      {/* Text content centered on top */}
      <div className="relative z-20 container text-center space-y-6 px-4">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide"
          style={{
            color: 'white',
            WebkitTextStroke: '1px black',
            textShadow: '0px 2px 4px rgba(0,0,0,0.5)' // Added shadow for extra depth
          }}
        >
          Technion B.Sc. Course Companion: Biotechnology & Food Engineering
        </h1>
        <p
          className="text-xl md:text-2xl font-medium max-w-4xl mx-auto"
          style={{
            color: 'white',
            WebkitTextStroke: '0.5px black',
            textShadow: '0px 1px 3px rgba(0,0,0,0.5)'
          }}
        >
          Your dedicated resource hub for the Biotechnology and Food Engineering program at the Technion. Find course materials, summaries, and helpful tools tailored to your degree. Explore the course structure below.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          {/* Link triggers the client-side scroll function */}
          <a href="#course-diagram" onClick={scrollToDiagram}>
            <Button className="w-full md:w-auto" size="lg" variant="secondary">
              Explore Courses
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
