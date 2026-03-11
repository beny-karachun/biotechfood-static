// src/app/courses/[courseName]/page.tsx

import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CourseHtmlViewer from './CourseHtmlViewer';

interface CoursePageProps {
  params: Promise<{
    courseName: string;
  }>;
}

// Helper function to sort filenames naturally (e.g., week1, week2, week10)
function naturalSort(a: string, b: string): number {
  const nameA = path.basename(a).replace(/\.(html|pdf)$/i, '').toLowerCase();
  const nameB = path.basename(b).replace(/\.(html|pdf)$/i, '').toLowerCase();

  const re = /(\d+)|([^\d]+)/g;
  const tokensA = nameA.match(re) || [];
  const tokensB = nameB.match(re) || [];

  const len = Math.min(tokensA.length, tokensB.length);
  for (let i = 0; i < len; i++) {
    const tokenA = tokensA[i];
    const tokenB = tokensB[i];

    const numA = parseInt(tokenA, 10);
    const numB = parseInt(tokenB, 10);

    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return numA - numB;
    } else {
      if (tokenA !== tokenB) return tokenA.localeCompare(tokenB);
    }
  }
  if (tokensA.length !== tokensB.length) {
    return tokensA.length - tokensB.length;
  }

  const extA = path.extname(a).toLowerCase();
  const extB = path.extname(b).toLowerCase();
  if (extA !== extB) {
    return extA.localeCompare(extB);
  }

  return 0;
}


export default async function CoursePage({ params }: CoursePageProps) {
  const { courseName } = await params;
  const decodedCourseName = decodeURIComponent(courseName);

  const directoryName = decodedCourseName;
  const courseDirPath = path.join(process.cwd(), 'public', 'courses', directoryName);

  let contentFiles: string[] = [];

  try {
    const files = await fs.promises.readdir(courseDirPath);
    contentFiles = files
      .filter((file) => file.toLowerCase().endsWith('.html') || file.toLowerCase().endsWith('.pdf'))
      .sort(naturalSort);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      notFound();
    } else {
      console.error(`[CoursePage] Failed to load course content for ${directoryName}:`, error);
    }
  }

  const filePaths = contentFiles.map(file =>
    `/courses/${directoryName}/${encodeURIComponent(file)}`
  );

  const titleParts = directoryName.match(/^(\d+)-(.*)/);
  const pageTitle = titleParts
    ? `${titleParts[1]} - ${titleParts[2].replace(/-/g, ' ')}`
    : directoryName;

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      {filePaths.length > 0 ? (
        (<CourseHtmlViewer files={filePaths} />)
      ) : (
        <p>No HTML or PDF content available for this course yet. Add files to the public/courses/{directoryName} folder.</p>
      )}
      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Course Diagram
        </Link>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CoursePageProps) {
  const { courseName } = await params;
  const decodedCourseName = decodeURIComponent(courseName);
  const titleParts = decodedCourseName.match(/^(\d+)-(.*)/);
  const pageTitle = titleParts
    ? `${titleParts[1]} - ${titleParts[2].replace(/-/g, ' ')}`
    : decodedCourseName;

  return {
    title: `${pageTitle} | Course Content`,
  };
}

// Required for static export: pre-generate all course pages at build time
export async function generateStaticParams() {
  const publicCoursesDir = path.join(process.cwd(), 'public', 'courses');
  try {
    const entries = await fs.promises.readdir(publicCoursesDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        courseName: entry.name,
      }));
  } catch (error) {
    console.error('Error reading courses directory for static params:', error);
    return [];
  }
}
