// No 'use client' here - this is now a Server Component

import React from 'react';
// Removed Link import as it's handled in HeroSection
// Removed Button import as it's handled in HeroSection
import CourseDiagram from '@/components/CourseDiagram'; // Server Component
import HeroSection from '@/components/HeroSection';   // Client Component

export default function Home() {
  // scrollToDiagram function is now inside HeroSection

  return (
    <>
      {/* Hero Section - Use the Client Component */}
      <HeroSection />

      {/* Sleek Separator - Kept here */}
      <div className="w-full bg-black py-1">
        <hr className="border-t border-dotted border-white/30 opacity-50" />
      </div>

      {/* Course Diagram Section - Rendered on the server */}
      {/* Ensure the ID matches the one used in HeroSection's scrollToDiagram */}
      <section id="course-diagram" className="container py-12 md:py-20 bg-background">
         <CourseDiagram />
      </section>
    </>
  );
}
