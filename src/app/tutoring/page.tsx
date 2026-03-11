'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useLanguage } from '@/lib/i18n';

export default function TutoringPage() {
  const { t, dir } = useLanguage();

  const courses = [
    {
      category: t('tutoring_page.math'),
      items: t('tutoring_page.math_courses') as unknown as string[], // Cast required due to nested array return
    },
    {
      category: t('tutoring_page.sciences'),
      items: t('tutoring_page.sciences_courses') as unknown as string[],
    },
    {
      category: t('tutoring_page.bio'),
      items: t('tutoring_page.bio_courses') as unknown as string[],
    },
    {
      category: t('tutoring_page.engineering'),
      items: t('tutoring_page.eng_courses') as unknown as string[],
    },
    {
      category: t('tutoring_page.cs'),
      items: t('tutoring_page.cs_courses') as unknown as string[],
    },
  ];

  const handleWhatsApp = () => {
    const phoneNumber = '972546123730';
    const message = encodeURIComponent(t('tutoring_page.whatsapp_message'));
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="container mx-auto pt-24 pb-10 px-4 max-w-4xl" dir={dir}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          {t('tutoring_page.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('tutoring_page.subtitle')}
        </p>
      </div>

      {/* What You Get */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">🎯</span>
            </div>
            <CardTitle className="text-lg">{t('tutoring_page.col1_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('tutoring_page.col1_desc')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">💡</span>
            </div>
            <CardTitle className="text-lg">{t('tutoring_page.col2_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('tutoring_page.col2_desc')}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">📱</span>
            </div>
            <CardTitle className="text-lg">{t('tutoring_page.col3_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('tutoring_page.col3_desc')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Courses */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">{t('tutoring_page.courses_title')}</CardTitle>
          <CardDescription>
            {t('tutoring_page.courses_desc')}
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
                  {Array.isArray(group.items) && group.items.map((item: string) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Icons.check className="h-3 w-3 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-primary mb-2">
                {t('tutoring_page.and_more')}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-3">{t('tutoring_page.cta_title')}</h2>
        <p className="text-muted-foreground mb-6">
          {t('tutoring_page.cta_subtitle')}
        </p>
        <Button
          size="lg"
          onClick={handleWhatsApp}
          className="px-8 py-6 text-lg rounded-full shadow-xl transition-transform hover:-translate-y-1"
        >
          <Icons.whatsapp className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          {t('tutoring_page.cta_button')}
        </Button>
      </div>
    </div>
  );
}
