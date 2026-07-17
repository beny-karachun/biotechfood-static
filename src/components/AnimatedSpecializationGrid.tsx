'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import type { SpecializationCourse, SpecializationTrack } from './SpecializationDiagram';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', duration: 0.3, bounce: 0 },
  },
};

function CourseTile({ course }: { course: SpecializationCourse }) {
  const { t } = useLanguage();
  const number = `${course.number}${course.marked ? '*' : ''}`;

  return (
    <motion.div
      className="flex h-full min-h-[116px] w-full flex-col"
      whileHover={course.exists ? { scale: 1.03, zIndex: 10 } : undefined}
      whileTap={course.exists ? { scale: 0.96 } : undefined}
    >
      {course.exists && course.slug ? (
        <>
          <Button
            asChild
            className={`h-full min-h-[88px] w-full flex-1 whitespace-normal rounded-xl px-2 py-3 text-center text-white shadow-sm transition-[background-color,box-shadow,opacity,transform] duration-300 hover:shadow-lg hover:shadow-orange-500/30 ${
              course.hasContent
                ? 'bg-primary hover:bg-primary/90'
                : 'bg-orange-500/80 opacity-80 hover:bg-orange-600/90'
            }`}
          >
            <Link href={course.slug} className="flex flex-col items-center justify-start">
              <span dir="ltr" className="shrink-0 text-xs font-bold tabular-nums tracking-tight">
                {number}
              </span>
              <span className="mt-1 line-clamp-3 overflow-hidden text-xs font-medium leading-tight drop-shadow-sm">
                {course.name}
              </span>
            </Link>
          </Button>
          <Badge
            variant={course.hasContent ? 'secondary' : 'outline'}
            className={`mt-1 self-center px-2 py-0.5 text-[10px] ${
              course.hasContent
                ? 'bg-blue-500 text-white hover:bg-blue-500'
                : 'border-dashed bg-background/50 text-muted-foreground'
            }`}
          >
            {course.hasContent ? t('specializations.available') : t('specializations.coming_soon')}
          </Badge>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            disabled
            className="h-full min-h-[88px] w-full flex-1 whitespace-normal rounded-xl border-2 border-dashed bg-muted/20 px-2 py-3 text-center text-muted-foreground disabled:opacity-100"
          >
            <span className="flex flex-col items-center justify-start">
              <span dir="ltr" className="shrink-0 text-xs font-semibold tabular-nums">
                {number}
              </span>
              <span className="mt-1 line-clamp-3 overflow-hidden text-xs leading-tight">{course.name}</span>
            </span>
          </Button>
          <Badge
            variant="outline"
            className="mt-1 self-center border-dashed px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {t('specializations.coming_soon')}
          </Badge>
        </>
      )}
    </motion.div>
  );
}

export default function AnimatedSpecializationGrid({ tracks }: { tracks: SpecializationTrack[] }) {
  const { language, t } = useLanguage();
  const maxTheoryCourses = Math.max(...tracks.map((track) => track.theory.length));

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-balance bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-3xl font-bold text-transparent drop-shadow-sm sm:text-4xl md:text-5xl"
        >
          {t('specializations.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35, ease: 'easeOut' }}
          className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base"
        >
          {t('specializations.subtitle')}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.35, ease: 'easeOut' }}
          className="mx-auto mt-4 w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm"
        >
          {t('specializations.selection_note')}
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {tracks.map((track) => (
          <motion.section
            key={track.id}
            variants={columnVariants}
            className="group relative overflow-hidden rounded-3xl bg-card/60 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] outline outline-1 outline-black/5 backdrop-blur-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_18px_42px_rgba(0,0,0,0.12)] dark:bg-card/40 dark:outline-white/10"
          >
            <div className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

            <header className="flex min-h-[108px] flex-col items-center justify-center border-b border-border/60 px-2 pb-4 pt-3 text-center">
              <span className="mb-2 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-primary/10 px-2 text-sm font-bold text-primary tabular-nums">
                {track.id}
              </span>
              <h2 className="text-balance text-base font-semibold leading-tight text-foreground/90">
                {language === 'he' ? track.title : track.titleEn}
              </h2>
            </header>

            <div className="mt-4">
              <h3 className="mb-3 min-h-[40px] text-balance text-center text-xs font-bold leading-tight text-primary">
                {t('specializations.theory')}
              </h3>
              <div className="grid gap-3 lg:auto-rows-[128px]">
                {track.theory.map((course) => (
                  <CourseTile key={`${course.number}-${course.name}`} course={course} />
                ))}
                {Array.from({ length: maxTheoryCourses - track.theory.length }).map((_, index) => (
                  <div key={`theory-spacer-${index}`} aria-hidden="true" className="hidden lg:block" />
                ))}
              </div>
              <div className="flex min-h-[44px] items-center justify-center px-2 pt-2 text-center text-[11px] leading-tight text-muted-foreground">
                {track.theoryNote ? t('specializations.choose_one') : null}
              </div>
            </div>

            <div className="mt-2 border-t border-border/60 pt-4">
              <h3 className="mb-3 min-h-[40px] text-balance text-center text-xs font-bold leading-tight text-primary">
                {t('specializations.research')}
              </h3>
              <div className="grid gap-3 lg:auto-rows-[128px]">
                {track.research.map((course) => (
                  <CourseTile key={`${course.number}-${course.name}`} course={course} />
                ))}
              </div>
              {track.researchNote ? (
                <p className="px-2 pt-3 text-center text-[11px] leading-tight text-muted-foreground">
                  {t('specializations.choose_one')}
                </p>
              ) : null}
            </div>
          </motion.section>
        ))}
      </motion.div>

      <p className="mx-auto mt-10 max-w-xl rounded-full bg-muted/30 px-4 py-2 text-center text-sm text-muted-foreground">
        {t('specializations.disclaimer')}
      </p>
    </div>
  );
}
