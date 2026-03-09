'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Icons } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronsUpDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from '@/hooks/use-is-mobile';

interface Course {
    id: string;
    name: string;
    courseId: string;
    semester: string;
    credits: number;
    grade: number;
    improvementPotential: number;
}

const STORAGE_KEY = 'technionprep_courses';

export default function AcademicCalculatorPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const isMobile = useIsMobile();

    // Input states
    const [newName, setNewName] = useState('');
    const [newCourseId, setNewCourseId] = useState('');
    const [newSemester, setNewSemester] = useState('');
    const [newCredits, setNewCredits] = useState('');
    const [newGrade, setNewGrade] = useState('');

    const [sortConfig, setSortConfig] = useState<{ key: keyof Course; direction: 'ascending' | 'descending' } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    // Load courses from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setCourses(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load saved courses:", e);
        }
        setIsLoaded(true);
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
            setSaveMessage("Saved!");
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (e) {
            console.error("Error saving:", e);
            setSaveMessage("Error saving");
        } finally {
            setIsSaving(false);
        }
    };

    const calculateImprovementPotentialValue = (grade: number, credits: number, currentAverage: number, currentTotalCredits: number) => {
        if (grade === 0) return 0;
        const potentialGrade = 100;
        const currentTotalPoints = currentAverage * currentTotalCredits;
        const oldCoursePoints = grade * credits;
        const newCoursePoints = potentialGrade * credits;
        const newTotalPoints = currentTotalPoints - oldCoursePoints + newCoursePoints;
        const newAverage = newTotalPoints / currentTotalCredits;
        return newAverage - currentAverage;
    };

    const addCourse = () => {
        if (!newName || !newCredits) return;
        const newCourse: Course = {
            id: Math.random().toString(36).substr(2, 9),
            name: newName,
            courseId: newCourseId,
            semester: newSemester,
            credits: parseFloat(newCredits),
            grade: newGrade ? parseFloat(newGrade) : 0,
            improvementPotential: 0,
        };
        setCourses([...courses, newCourse]);
        setNewName('');
        setNewCourseId('');
        setNewSemester('');
        setNewCredits('');
        setNewGrade('');
    };

    const removeCourse = (id: string) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    const updateCourse = (id: string, field: keyof Course, value: string) => {
        setCourses(prev => prev.map(course => {
            if (course.id === id) {
                if (field === 'credits' || field === 'grade') {
                    const parsed = parseFloat(value);
                    return { ...course, [field]: isNaN(parsed) ? 0 : parsed };
                }
                return { ...course, [field]: value };
            }
            return course;
        }));
    };

    const totalCredits = courses.reduce((acc, course) => acc + (course.credits || 0), 0);
    const weightedSum = courses.reduce((acc, course) => acc + ((course.grade || 0) * (course.credits || 0)), 0);
    const average = totalCredits > 0 ? weightedSum / totalCredits : 0;

    const coursesWithPotential = useMemo(() => {
        return courses.map(course => ({
            ...course,
            improvementPotential: calculateImprovementPotentialValue(course.grade, course.credits, average, totalCredits)
        }));
    }, [courses, average, totalCredits]);

    const sortedCourses = useMemo(() => {
        let sortableCourses = [...coursesWithPotential];
        if (sortConfig !== null) {
            sortableCourses.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCourses;
    }, [coursesWithPotential, sortConfig]);

    const requestSort = (key: keyof Course) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (!isLoaded) {
        return <div className="flex h-screen items-center justify-center"><Icons.spinner className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto py-6 sm:py-10 px-4 max-w-5xl">
            <Card>
                <CardHeader className="px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div>
                            <CardTitle className="text-xl sm:text-2xl">Academic Calculator</CardTitle>
                            <CardDescription className="text-sm">Calculate your GPA and see how improving specific grades affects your average.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            {saveMessage && (
                                <span className={`text-sm font-medium animate-in fade-in slide-in-from-right-2 ${saveMessage.includes('Error') ? 'text-destructive' : 'text-green-600'}`}>
                                    {saveMessage}
                                </span>
                            )}
                            <Button onClick={handleSave} disabled={isSaving} size={isMobile ? "sm" : "default"}>
                                {isSaving ? <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Icons.save className="mr-2 h-4 w-4" /> Save</>}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    {/* Input Form */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-6">
                        <div className="col-span-2 sm:col-span-3 md:col-span-2">
                            <Input placeholder="Course Name *" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        </div>
                        <div>
                            <Input placeholder="ID (opt)" value={newCourseId} onChange={(e) => setNewCourseId(e.target.value)} />
                        </div>
                        <div>
                            <Input placeholder="Sem (opt)" value={newSemester} onChange={(e) => setNewSemester(e.target.value)} />
                        </div>
                        <div>
                            <Input type="number" placeholder="Credits *" step="0.5" value={newCredits} onChange={(e) => setNewCredits(e.target.value)} />
                        </div>
                        <div>
                            <Input type="number" placeholder="Grade (opt)" value={newGrade} onChange={(e) => setNewGrade(e.target.value)} />
                        </div>
                        <Button onClick={addCourse} className="col-span-2 sm:col-span-3 md:col-span-6 mt-1">Add Course</Button>
                    </div>

                    {/* Stats Summary */}
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-muted/50 p-4 rounded-lg mb-6 border gap-2">
                        <div className="text-base sm:text-lg font-medium">Total Credits: <span className="font-bold">{totalCredits}</span></div>
                        <div className="text-lg sm:text-xl font-bold text-primary">Average: {average.toFixed(2)}</div>
                    </div>

                    {/* Mobile Card Layout */}
                    {isMobile ? (
                        <div className="space-y-3">
                            {sortedCourses.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8 border rounded-lg">
                                    No courses added yet. Start by entering course details above.
                                </div>
                            ) : (
                                sortedCourses.map((course) => (
                                    <div key={course.id} className="border rounded-lg p-4 bg-card space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <Input
                                                    value={course.name}
                                                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                                    className="h-8 text-sm font-medium border-none p-0 focus-visible:ring-0 bg-transparent"
                                                />
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)} className="h-8 w-8 text-destructive hover:text-destructive/90 shrink-0 ml-2">
                                                <Icons.trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] text-muted-foreground uppercase tracking-wider">ID</label>
                                                <Input
                                                    value={course.courseId}
                                                    onChange={(e) => updateCourse(course.id, 'courseId', e.target.value)}
                                                    className="h-8 text-sm mt-1"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-muted-foreground uppercase tracking-wider">Semester</label>
                                                <Input
                                                    value={course.semester}
                                                    onChange={(e) => updateCourse(course.id, 'semester', e.target.value)}
                                                    className="h-8 text-sm mt-1"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-muted-foreground uppercase tracking-wider">Credits</label>
                                                <Input
                                                    type="number"
                                                    step="0.5"
                                                    value={course.credits}
                                                    onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                                                    className="h-8 text-sm mt-1"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] text-muted-foreground uppercase tracking-wider">Grade</label>
                                                <Input
                                                    type="number"
                                                    value={course.grade === 0 ? '' : course.grade}
                                                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                                    className="h-8 text-sm mt-1"
                                                />
                                            </div>
                                        </div>
                                        {course.grade > 0 && course.grade < 100 && (
                                            <div className="text-sm text-green-600 font-medium pt-1 border-t border-border/50">
                                                Improvement Potential: +{course.improvementPotential.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        /* Desktop Table Layout */
                        <div className="rounded-md border overflow-x-auto overflow-y-hidden shadow-sm">
                            <div className="min-w-[800px]">
                                <Table>
                                    <TableCaption>Click column headers to sort the table.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead onClick={() => requestSort('name')} className="cursor-pointer hover:text-primary transition-colors">Course Name <ChevronsUpDown className="ml-2 h-4 w-4 inline opacity-50" /></TableHead>
                                            <TableHead onClick={() => requestSort('courseId')} className="cursor-pointer hover:text-primary transition-colors">ID <ChevronsUpDown className="ml-2 h-4 w-4 inline opacity-50" /></TableHead>
                                            <TableHead onClick={() => requestSort('semester')} className="cursor-pointer hover:text-primary transition-colors">Sem <ChevronsUpDown className="ml-2 h-4 w-4 inline opacity-50" /></TableHead>
                                            <TableHead onClick={() => requestSort('credits')} className="cursor-pointer hover:text-primary transition-colors">Credits <ChevronsUpDown className="ml-2 h-4 w-4 inline opacity-50" /></TableHead>
                                            <TableHead onClick={() => requestSort('grade')} className="cursor-pointer hover:text-primary transition-colors">Grade <ChevronsUpDown className="ml-2 h-4 w-4 inline opacity-50" /></TableHead>
                                            <TableHead onClick={() => requestSort('improvementPotential')} className="cursor-pointer hover:text-primary transition-colors flex items-center">
                                                Imp. Potential <ChevronsUpDown className="ml-2 h-4 w-4 inline opacity-50" />
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 ml-1 text-muted-foreground hover:text-primary cursor-help" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-xs">
                                                            <p>This value represents how much your total average would increase if you improved this course's grade to 100.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedCourses.map((course) => (
                                            <TableRow key={course.id}>
                                                <TableCell>
                                                    <Input
                                                        value={course.name}
                                                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                                        className="h-8 w-full min-w-[120px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={course.courseId}
                                                        onChange={(e) => updateCourse(course.id, 'courseId', e.target.value)}
                                                        className="h-8 w-full min-w-[80px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={course.semester}
                                                        onChange={(e) => updateCourse(course.id, 'semester', e.target.value)}
                                                        className="h-8 w-full min-w-[60px]"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.5"
                                                        value={course.credits}
                                                        onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                                                        className="h-8 w-20"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={course.grade === 0 ? '' : course.grade}
                                                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                                        className="h-8 w-20"
                                                    />
                                                </TableCell>
                                                <TableCell className={course.grade > 0 && course.grade < 100 ? "text-green-600 font-medium align-middle" : "text-muted-foreground align-middle"}>
                                                    {course.grade > 0 && course.grade < 100 ? `+${course.improvementPotential.toFixed(2)}` : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)} className="h-8 w-8 text-destructive hover:text-destructive/90">
                                                        <Icons.trash className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {sortedCourses.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                    No courses added yet. Start by entering course details above.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
