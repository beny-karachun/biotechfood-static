// src/app/courses/[courseName]/page.tsx

import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CourseHtmlViewer from './CourseHtmlViewer'; // Keep .tsx if it's a TSX file

interface CoursePageProps {
  params: {
    courseName: string; // This will be the full slug like "064212-טכנולוגיה-של-מזון"
  };
}

// Helper function to sort filenames naturally (e.g., week1, week2, week10)
function naturalSort(a: string, b: string): number {
  // Extract base names without extensions for comparison
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

    // Compare numbers numerically, strings alphabetically
    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA !== numB) return numA - numB;
    } else {
      if (tokenA !== tokenB) return tokenA.localeCompare(tokenB);
    }
  }
  // Handle cases like "week1" vs "week10"
  if (tokensA.length !== tokensB.length) {
    return tokensA.length - tokensB.length;
  }

  // If names are identical except extension, maybe sort by type (e.g., html before pdf)? Optional.
  const extA = path.extname(a).toLowerCase();
  const extB = path.extname(b).toLowerCase();
  if (extA !== extB) {
    return extA.localeCompare(extB); // Simple alphabetical sort for extensions
  }

  return 0; // Files are effectively the same for sorting
}


export default async function CoursePage({ params }: CoursePageProps) {
  // Decode the course name parameter from the URL
  const decodedCourseName = decodeURIComponent(params.courseName);
  console.log(`[CoursePage] Received raw params.courseName: ${params.courseName}`);
  console.log(`[CoursePage] Decoded courseName: ${decodedCourseName}`);

  // The decoded name should directly match the directory name
  const directoryName = decodedCourseName;
  const courseDirPath = path.join(process.cwd(), 'public', 'courses', directoryName);
  console.log(`[CoursePage] Attempting to read directory: ${courseDirPath}`);

  let contentFiles: string[] = [];

  try {
    const files = await fs.promises.readdir(courseDirPath);
    // Filter for .html AND .pdf files and sort them naturally
    contentFiles = files
      .filter((file) => file.toLowerCase().endsWith('.html') || file.toLowerCase().endsWith('.pdf'))
      .sort(naturalSort); // Use the updated natural sort

    console.log(`[CoursePage] Found files in ${directoryName}:`, contentFiles);

  } catch (error: any) {
    // If directory doesn't exist, trigger a 404 page
    if (error.code === 'ENOENT') {
      console.warn(`[CoursePage] Directory not found: ${courseDirPath}`);
      notFound(); // Trigger Next.js 404 page
    } else {
      // For other errors, log them and potentially show an error message
      console.error(`[CoursePage] Failed to load course content for ${directoryName}:`, error);
      // You might want to return an error message component here instead of crashing
      // For now, we'll let it proceed and likely show the "No content" message.
    }
  }

  // Construct full paths relative to the public directory for client component props
  // Ensure the directoryName used here is the decoded one
  // Encode the filename part to handle special characters in iframe src
  const filePaths = contentFiles.map(file =>
    `/courses/${directoryName}/${encodeURIComponent(file)}` // <-- Encode the filename
  );

  // Extract a more readable title (e.g., "064212 - טכנולוגיה של מזון")
  // Basic split assuming format "NUMBER-NAME"
  const titleParts = directoryName.match(/^(\d+)-(.*)/);
  const pageTitle = titleParts
    ? `${titleParts[1]} - ${titleParts[2].replace(/-/g, ' ')}` // Replace hyphens back with spaces for display
    : directoryName; // Fallback to the raw name

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      {filePaths.length > 0 ? (
        (<CourseHtmlViewer files={filePaths} />) // Pass the combined list of HTML and PDF paths
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

// Optional: Generate metadata if needed (make sure it also uses decodedCourseName)
export async function generateMetadata({ params }: CoursePageProps) {
  const decodedCourseName = decodeURIComponent(params.courseName);
  console.log(`[generateMetadata] Decoded courseName: ${decodedCourseName}`);
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


