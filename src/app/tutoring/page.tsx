'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';

const courses = [
  {
    category: 'Mathematics',
    items: ['Calculus 1 & 2', 'Linear Algebra', 'Differential Equations', 'Probability & Statistics'],
  },
  {
    category: 'Sciences',
    items: ['Physics 1 & 2', 'General Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
  },
  {
    category: 'Biology & Biotechnology',
    items: ['Biology 1 & 2', 'Biochemistry & Enzymology', 'Molecular Biotechnology', 'Microbiology'],
  },
  {
    category: 'Engineering',
    items: ['Fluid Mechanics', 'Heat Transfer', 'Mass Transfer', 'Food Engineering'],
  },
  {
    category: 'Computer Science',
    items: ['Python Programming', 'Data Structures', 'Introduction to CS'],
  },
];

export default function TutoringPage() {
  const handleWhatsApp = () => {
    const phoneNumber = '972546123730';
    const message = encodeURIComponent('היי בני, אני מעוניין/ת בשיעור פרטי 📚');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Private Tutoring
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Struggling with a course? Get personalized 1-on-1 tutoring sessions from a fellow Technion student
          who&apos;s been through it all.
        </p>
      </div>

      {/* What You Get */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">🎯</span>
            </div>
            <CardTitle className="text-lg">Focused Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tailored to your specific needs — whether it&apos;s exam prep, homework help, or deep concept review.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">💡</span>
            </div>
            <CardTitle className="text-lg">Real Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn from someone who took the same courses, with the same professors, at the Technion.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">📱</span>
            </div>
            <CardTitle className="text-lg">Flexible Format</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              In-person at the Technion or online via Zoom — whatever works best for you.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Courses */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Available Courses</CardTitle>
          <CardDescription>
            Tutoring is available for most courses in the Biotechnology & Food Engineering program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((group) => (
              <div key={group.category}>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-2">
                  {group.category}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icons.check className="h-3 w-3 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">
          Send me a message on WhatsApp and we&apos;ll schedule your first session.
        </p>
        <Button
          size="lg"
          onClick={handleWhatsApp}
          className="px-8 py-6 text-lg rounded-full shadow-xl transition-transform hover:-translate-y-1"
        >
          <Icons.whatsapp className="mr-2 h-5 w-5" />
          Contact via WhatsApp
        </Button>
      </div>
    </div>
  );
}
