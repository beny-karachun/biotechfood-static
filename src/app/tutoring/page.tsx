'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useLanguage } from '@/lib/i18n';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  },
};

const cardHoverVariants = {
  rest: { y: 0, boxShadow: '0px 4px 10px rgba(0,0,0,0.0)' },
  hover: { 
    y: -8, 
    boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { type: 'spring' as const, stiffness: 400, damping: 25 }
  }
};

const iconHoverVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.2, 
    rotate: [0, -10, 10, -10, 0],
    transition: { duration: 0.5, ease: "easeInOut" as const }
  }
};

const pulseVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    boxShadow: '0px 0px 20px rgba(255, 140, 0, 0.4)', // Assuming orange primary color
    transition: { type: 'spring' as const, stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

const BackgroundMicroscope = ({ 
  className = "", 
  style = {},
}: { 
  className?: string; 
  style?: React.CSSProperties;
}) => {
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 0.75"]
  });
  
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className={`absolute pointer-events-none z-0 ${className}`}
      style={style}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <motion.path d="M6 18h8" style={{ pathLength }} />
        <motion.path d="M3 22h18" style={{ pathLength }} />
        <motion.path d="M14 22a7 7 0 1 0 0-14h-1" style={{ pathLength }} />
        <motion.path d="M9 14h2" style={{ pathLength }} />
        <motion.path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" style={{ pathLength }} />
        <motion.path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" style={{ pathLength }} />
      </motion.svg>
    </div>
  );
};

export default function TutoringPage() {
  const { t, dir } = useLanguage();

  const courses = [
    {
      category: t('tutoring_page.math'),
      items: t('tutoring_page.math_courses') as unknown as string[], 
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
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Scattered Background SVGs */}
      <BackgroundMicroscope className="w-24 h-24 opacity-30" style={{ top: '6%', left: '8%', rotate: '15deg' }} />
      <BackgroundMicroscope className="w-16 h-16 opacity-40" style={{ top: '15%', right: '12%', rotate: '-25deg' }} />
      <BackgroundMicroscope className="w-32 h-32 opacity-20" style={{ top: '25%', left: '15%', rotate: '45deg' }} />
      <BackgroundMicroscope className="w-12 h-12 opacity-50" style={{ top: '35%', right: '8%', rotate: '-15deg' }} />
      <BackgroundMicroscope className="w-48 h-48 opacity-15" style={{ top: '48%', left: '-2%', rotate: '20deg' }} />
      <BackgroundMicroscope className="w-20 h-20 hidden sm:block opacity-40" style={{ top: '58%', right: '22%', rotate: '-40deg' }} />
      <BackgroundMicroscope className="w-8 h-8 opacity-60" style={{ top: '65%', left: '10%', rotate: '10deg' }} />
      <BackgroundMicroscope className="w-64 h-64 opacity-10" style={{ top: '75%', right: '-5%', rotate: '-35deg' }} />
      <BackgroundMicroscope className="w-16 h-16 hidden sm:block opacity-50" style={{ top: '85%', left: '28%', rotate: '30deg' }} />
      <BackgroundMicroscope className="w-32 h-32 opacity-30" style={{ top: '92%', right: '15%', rotate: '-10deg' }} />

    <motion.div 
      className="container mx-auto pt-24 pb-10 px-4 max-w-4xl" 
      dir={dir}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center mb-12" variants={itemVariants}>
        <motion.h1 
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' as const, bounce: 0.4 }}
        >
          {t('tutoring_page.title')}
        </motion.h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('tutoring_page.subtitle')}
        </p>
      </motion.div>

      {/* CTA (Moved to top) */}
      <motion.div className="text-center mb-16 relative" variants={itemVariants}>
        {/* Glow effect behind button */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-1/2 h-32 bg-primary/20 blur-[100px] rounded-full"></div>
        </div>

        <h2 className="text-2xl font-bold mb-3">{t('tutoring_page.cta_title')}</h2>
        <p className="text-muted-foreground mb-6">
          {t('tutoring_page.cta_subtitle')}
        </p>
        <motion.div
           variants={pulseVariants}
           initial="rest"
           whileHover="hover"
           whileTap="tap"
           className="inline-block rounded-full"
        >
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="px-8 py-6 text-lg rounded-full shadow-xl inline-flex items-center overflow-hidden relative group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <Icons.whatsapp className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'} group-hover:rotate-12 transition-transform`} />
              <span className="relative z-10">{t('tutoring_page.cta_button')}</span>
            </Button>
        </motion.div>
      </motion.div>

      {/* What You Get */}
      <motion.div 
        className="grid gap-6 md:grid-cols-3 mb-16"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} whileHover="hover" initial="rest">
            <Card className="text-center h-full border-border/50 hover:border-primary/30 transition-colors backdrop-blur-sm bg-card/80">
              <CardHeader className="pb-3">
                <motion.div 
                    variants={iconHoverVariants}
                    className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 select-none shadow-inner"
                >
                  <span className="text-3xl">🎯</span>
                </motion.div>
                <CardTitle className="text-lg">{t('tutoring_page.col1_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('tutoring_page.col1_desc')}
                </p>
              </CardContent>
            </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover" initial="rest">
            <Card className="text-center h-full border-border/50 hover:border-primary/30 transition-colors backdrop-blur-sm bg-card/80">
              <CardHeader className="pb-3">
                <motion.div 
                     variants={iconHoverVariants}
                     className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 select-none shadow-inner"
                >
                  <span className="text-3xl">💡</span>
                </motion.div>
                <CardTitle className="text-lg">{t('tutoring_page.col2_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('tutoring_page.col2_desc')}
                </p>
              </CardContent>
            </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover="hover" initial="rest">
            <Card className="text-center h-full border-border/50 hover:border-primary/30 transition-colors backdrop-blur-sm bg-card/80">
              <CardHeader className="pb-3">
                <motion.div 
                    variants={iconHoverVariants}
                    className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 select-none shadow-inner"
                >
                  <span className="text-3xl">📱</span>
                </motion.div>
                <CardTitle className="text-lg">{t('tutoring_page.col3_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('tutoring_page.col3_desc')}
                </p>
              </CardContent>
            </Card>
        </motion.div>
      </motion.div>

      {/* Available Courses */}
      <motion.div variants={itemVariants}>
          <Card className="mb-12 overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm shadow-xl relative">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-2xl flex items-center gap-2">
                  <Icons.bookOpen className="h-6 w-6 text-primary" />
                  {t('tutoring_page.courses_title')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('tutoring_page.courses_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <motion.div 
                className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {courses.map((group) => (
                  <motion.div key={group.category} variants={itemVariants} className="group/category">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-4 pb-2 border-b border-primary/20 inline-block">
                      {group.category}
                    </h3>
                    <ul className="space-y-2">
                      {Array.isArray(group.items) && group.items.map((item: string, i: number) => (
                        <motion.li 
                            key={item} 
                            className="text-sm text-muted-foreground flex items-start gap-2 group-hover/category:text-foreground transition-colors mix-blend-luminosity"
                            initial={{ opacity: 0, x: dir === 'rtl' ? 10 : -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                        >
                          <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5 opacity-70 group-hover/category:opacity-100 transition-opacity" />
                          <span className="leading-tight">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
                <motion.div variants={itemVariants} className="group/category">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-4 pb-2 border-b border-primary/20 inline-block">
                    {t('tutoring_page.and_more')}
                  </h3>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
      </motion.div>
    </motion.div>
    </main>
  );
}
