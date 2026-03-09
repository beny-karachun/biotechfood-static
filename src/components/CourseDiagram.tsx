// This is now an async Server Component
import fs from 'fs'; // Import Node.js fs module
import path from 'path'; // Import Node.js path module
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from '@/components/icons'; // Import Icons if needed for the button

// Helper to sanitize Hebrew names for directory paths
function sanitizeNameForPath(name: string): string {
  // Replace spaces with hyphens and remove characters not suitable for paths
  return name.replace(/\s+/g, '-').replace(/[`"'?*]/g, '');
}

// Define the structure for course information
interface CourseInfo {
  name: string;
  number: number | string;
  slug: string | null;
  exists: boolean;
  hasContent: boolean; // Has actual HTML/PDF files (not just .gitkeep)
  semester: number;
  isInternalLink?: boolean;
  icon?: keyof typeof Icons;
}

// Define the base course data (exists and slug will be determined server-side)
const baseCourseData: Omit<CourseInfo, 'exists' | 'hasContent' | 'slug' | 'isInternalLink'>[] = [
  // Semesters 1-7 data... (as provided before)
  // Semester 1
  { name: `חדוא 1מ`, number: 104018, semester: 1 },
  { name: `אלגברה לינארית מ`, number: 104019, semester: 1 },
  { name: `מבוא להנדסת ביוטכנולוגיה ומזון`, number: "064522", semester: 1 },
  { name: `ביולוגיה 1`, number: 134058, semester: 1 },
  { name: `יסודות הכימיה`, number: 124120, semester: 1 },

  // Semester 2
  { name: `חדוא 2מ`, number: 104022, semester: 2 },
  { name: `אנגלית טכנית מתקדמים ב`, number: 324033, semester: 2 },
  { name: `ביוכימיה ואנזימולוגיה`, number: 134019, semester: 2 },
  { name: `כימיה אורגנית`, number: 125801, semester: 2 },
  { name: `כימיה אנליטית`, number: 125101, semester: 2 },
  { name: `פיסיקה 1`, number: 114051, semester: 2 },

  // Semester 3
  { name: `מדר ח`, number: 104131, semester: 3 },
  { name: `פייתון`, number: 234128, semester: 3 },
  { name: `טכנולוגיה של מזון`, number: "064212", semester: 3 },
  { name: `מבוא לביוט מולקולרית`, number: "064523", semester: 3 },
  { name: `מסלולים מטבוליים`, number: 134113, semester: 3 },
  { name: `כימיה פיסיקלית`, number: 124510, semester: 3 },

  // Semester 4
  { name: `מדח מ`, number: 104228, semester: 4 },
  { name: `מכניקה של זורמים`, number: "064115", semester: 4 },
  { name: `מיקרוביולוגיה כללית`, number: "064419", semester: 4 },
  { name: `מעבדה במיקרוביולוגיה`, number: "064413", semester: 4 },
  { name: `כימיה של מזון`, number: "064322", semester: 4 },
  { name: `מעבדה בביוכימיה`, number: "064325", semester: 4 },
  { name: `פיסיקה 2`, number: 114052, semester: 4 },

  // Semester 5
  { name: `תופעות מעבר חום`, number: "064117", semester: 5 },
  { name: `ביוטכנולוגיה מולקולרית`, number: "064507", semester: 5 },
  { name: `מיקרוביולוגיה של מזון`, number: "064420", semester: 5 },
  { name: `שיטות אנליטיות`, number: "064324", semester: 5 },
  { name: `מעבדה באנליזה`, number: "064326", semester: 5 },
  { name: `תרמודינמיקה`, number: "064106", semester: 5 },

  // Semester 6
  { name: `תופעות מעבר חומר`, number: "064118", semester: 6 },
  { name: `סטטיסטיקה`, number: "094481", semester: 6 },
  { name: `שיטות נומריות`, number: "064120", semester: 6 },
  { name: `מדע וטכנולוגיה של ביוחומרים`, number: "064250", semester: 6 },
  { name: `בחירת קורסי מגמות`, number: "??", semester: 6 },

  // Semester 7
  { name: `מעבדה בהנדסת תהליכים`, number: "064239", semester: 7 },
  { name: `תהליכי יסוד`, number: "064509", semester: 7 },
  { name: `תזונה`, number: "064615", semester: 7 },
  { name: `בחירת קורסי מגמות`, number: "??", semester: 7 },

  // Semester 8 (כלי עזר)
  { name: "טסטר לפייתון", number: "1", semester: 8 }, // Consider adding an icon: icon: 'code' or similar
  { name: "ספרות משמעותיות", number: "2", semester: 8 }, // Consider adding an icon: icon: 'book' or similar
  { name: "CFU Calculator", number: "3", semester: 8 },
];


// Function to check existence and update course data (runs on the server)
async function getProcessedCourseData(): Promise<CourseInfo[]> {
  const publicCoursesDir = path.join(process.cwd(), 'public', 'courses');

  const courseData: CourseInfo[] = await Promise.all(baseCourseData.map(async (course) => {
    const courseNumberStr = String(course.number);
    const sanitizedName = sanitizeNameForPath(course.name);
    const expectedFolderName = `${courseNumberStr}-${sanitizedName}`;

    let exists = false;
    let hasContent = false;
    let slug: string | null = null;
    let isInternalLink = false;

    // Skip placeholders
    if (course.name !== "בחירת קורסי מגמות" && course.number !== "??") {
      const courseDirPath = path.join(publicCoursesDir, expectedFolderName);
      try {
        const files = await fs.promises.readdir(courseDirPath);
        // Folder exists — always make it clickable
        exists = true;
        slug = `/courses/${expectedFolderName}`;
        isInternalLink = true;
        // Check if there are actual content files (not just .gitkeep)
        hasContent = files.some(file =>
          file.toLowerCase().endsWith('.html') || file.toLowerCase().endsWith('.pdf')
        );
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          console.error(`Error checking directory ${expectedFolderName} for course ${courseNumberStr}:`, error);
        }
      }
    }

    return {
      ...course,
      exists,
      hasContent,
      slug,
      isInternalLink,
    };
  }));

  return courseData;
}



// Import the new Client Component for animations
import AnimatedCourseGrid from './AnimatedCourseGrid';

// Renamed component export - Now an async Server Component
export default async function CourseDiagram() {
  const courseData = await getProcessedCourseData(); // Get data processed on the server

  return <AnimatedCourseGrid courseData={courseData} />;
}
