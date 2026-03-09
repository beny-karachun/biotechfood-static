import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // To show tags like skill level

interface CourseCardProps {
  title: string;
  description: string;
  // imageUrl prop removed
  skillLevel: string;
  courseSlug: string; // URL slug for the course details page
}

export function CourseCard({
  title,
  description,
  // imageUrl removed
  skillLevel,
  courseSlug
}: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      {/* Removed Image Section */}
      <CardHeader>
        <CardTitle className="text-lg leading-tight font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Additional content can go here if needed */}
        <Badge variant="outline">{skillLevel}</Badge>
      </CardContent>
      <CardFooter className="pt-4"> {/* Added padding-top */}
        <Link href={`/courses/${courseSlug}`} className="w-full">
          <Button variant="outline" className="w-full">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
