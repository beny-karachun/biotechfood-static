'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from '@/components/icons';

// Minimal interface needed for rendering
interface CourseInfo {
    name: string;
    number: number | string;
    slug: string | null;
    exists: boolean;
    hasContent: boolean;
    semester: number;
    icon?: keyof typeof Icons;
}

export default function AnimatedCourseGrid({ courseData }: { courseData: CourseInfo[] }) {
    // Helper to group courses by semester
    const coursesBySemester = courseData.reduce((acc, course) => {
        const semester = course.semester;
        if (!acc[semester]) {
            acc[semester] = [];
        }
        acc[semester].push(course);
        return acc;
    }, {} as Record<number, CourseInfo[]>);

    // Calculate the maximum number of courses in any semester
    const maxCourses = Object.values(coursesBySemester).reduce(
        (max, courses) => Math.max(max, courses.length),
        0
    );

    const courseRowHeight = "112px"; // h-28

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="container mx-auto py-8 px-4" dir="rtl">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400 drop-shadow-sm"
            >
                לחצו על הקורסים הקיימים כדי להיכנס לעמוד הקורס
            </motion.h1>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-start"
            >
                {Object.entries(coursesBySemester)
                    .sort(([semA], [semB]) => parseInt(semA) - parseInt(semB))
                    .map(([semester, courses]) => (
                        <motion.div
                            key={semester}
                            variants={itemVariants}
                            className="flex flex-col items-center p-3 border border-border/50 rounded-xl bg-card/60 backdrop-blur-sm shadow-sm dark:bg-card/40 w-full space-y-4 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
                        >
                            {/* Subtle top accent line for columns */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <h2 className="text-xl font-semibold mb-2 border-b border-border/60 pb-2 w-full text-center flex-shrink-0 text-foreground/90">
                                {parseInt(semester) === 8 ? 'כלי עזר' : `סמסטר ${semester}`}
                            </h2>

                            <div
                                className="w-full relative z-10 flex flex-col md:grid gap-4"
                                style={{
                                    // Only apply grid row template on md+ screens
                                    ...(window.innerWidth >= 768 ? { gridTemplateRows: `repeat(${maxCourses}, ${courseRowHeight})` } : {})
                                }}
                            >
                                {courses.map((course, index) => {
                                    const IconComponent = course.icon ? Icons[course.icon] : null;

                                    return (
                                        <motion.div
                                            key={`${course.name}-${course.number}`}
                                            className="w-full md:h-full md:absolute md:top-0"
                                            style={window.innerWidth >= 768 ? {
                                                top: `calc(${index} * (${courseRowHeight} + 1rem))`,
                                                height: courseRowHeight
                                            } : {}}
                                            whileHover={course.exists ? { scale: 1.05, zIndex: 10 } : {}}
                                            whileTap={course.exists ? { scale: 0.95 } : {}}
                                        >
                                            {course.exists && course.slug ? (
                                                <Link href={course.slug} className="block w-full group/card h-full flex flex-col relative min-h-[90px] md:min-h-0">
                                                    <Button
                                                        variant="default"
                                                        className={`w-full h-full py-2 px-2 mb-1 whitespace-normal flex flex-col items-center justify-start text-center flex-grow text-white shadow-sm transition-all duration-300 group-hover/card:shadow-orange-500/30 group-hover/card:shadow-lg ${!course.hasContent ? 'opacity-80 bg-orange-500/80 hover:bg-orange-600/90' : 'bg-primary hover:bg-primary/90'}`}
                                                    >
                                                        {IconComponent && <IconComponent className="h-4 w-4 mb-0.5" />}
                                                        <span className="font-bold text-xs sm:text-[11px] md:text-xs mb-0.5 tracking-tight shrink-0">{course.number}</span>
                                                        <span className="leading-tight font-medium drop-shadow-sm text-xs sm:text-[11px] md:text-xs line-clamp-3 md:line-clamp-2 overflow-hidden px-0.5">{course.name}</span>
                                                    </Button>

                                                    {course.hasContent ? (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-[10px] md:text-xs px-2 py-0.5 self-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover/card:-translate-y-1"
                                                            style={{ backgroundColor: '#3b82f6', color: '#FFFFFF' }} // Nice modern blue
                                                        >
                                                            {parseInt(semester) === 8 ? 'כלי עזר' : 'קיים קורס'}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-dashed border-border/80 text-muted-foreground bg-background/50 text-[10px] md:text-xs px-2 py-0.5 self-center flex-shrink-0 transition-transform duration-300 group-hover/card:-translate-y-1">עדיין לא קיים</Badge>
                                                    )}
                                                </Link>
                                            ) : (
                                                <div className="w-full group/disabled h-full flex flex-col opacity-60 min-h-[90px] md:min-h-0">
                                                    <Button
                                                        variant="outline"
                                                        disabled
                                                        className="w-full h-full py-2 px-2 mb-1 whitespace-normal flex flex-col items-center justify-start text-center border-dashed border-2 disabled:opacity-100 flex-grow text-muted-foreground bg-muted/20"
                                                    >
                                                        {IconComponent && <IconComponent className="h-4 w-4 mb-0.5 opacity-50" />}
                                                        <span className="font-semibold text-xs sm:text-[11px] md:text-xs mb-0.5 shrink-0">{course.number}</span>
                                                        <span className="leading-tight text-xs sm:text-[11px] md:text-xs line-clamp-3 md:line-clamp-2 overflow-hidden px-0.5">{course.name}</span>
                                                    </Button>
                                                    <Badge variant="outline" className="border-dashed text-muted-foreground text-[10px] md:text-xs px-2 py-0.5 self-center flex-shrink-0">עדיין לא קיים</Badge>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-center text-muted-foreground mt-12 text-sm bg-muted/30 py-2 rounded-full max-w-lg mx-auto"
            >
                הערה: זוהי הצגה סמסטריאלית של הקורסים. קשרי קדם אינם מוצגים ויזואלית.
            </motion.p>
        </div>
    );
}
