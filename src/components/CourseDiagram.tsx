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
  exists: boolean; // This will be updated dynamically
  semester: number;
  isInternalLink?: boolean;
  icon?: keyof typeof Icons; // Optional icon name
}

// Define the base course data (exists and slug will be determined server-side)
const baseCourseData: Omit<CourseInfo, 'exists' | 'slug' | 'isInternalLink'>[] = [
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
    let slug: string | null = null;
    let isInternalLink = false;


    // --- Default File System Check Logic ---
    // Check only if the course name isn't a placeholder like ??
    if (course.name !== "בחירת קורסי מגמות" && course.number !== "??") {
      const courseDirPath = path.join(publicCoursesDir, expectedFolderName);
      try {
        const files = await fs.promises.readdir(courseDirPath);
        if (files.some(file => file.toLowerCase().endsWith('.html'))) {
          exists = true;
        }
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          console.error(`Error checking directory ${expectedFolderName} for course ${courseNumberStr}:`, error);
        }
        exists = false;
      }
    }

    // Set slug and link type if the course exists (has HTML files)
    if (exists) {
      slug = `/courses/${expectedFolderName}`;
      isInternalLink = true;
    }
    // --- End Default Logic ---


    return {
      ...course,
      exists,
      slug,
      isInternalLink,
    };
  }));

  return courseData;
}


// Renamed component export - Now an async Server Component
export default async function CourseDiagram() {
  const courseData = await getProcessedCourseData(); // Get data processed on the server

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

  // Define the fixed height for each course row/box
  const courseRowHeight = "112px"; // h-28

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-10">לחצו על הקורסים הקיימים כדי להיכנס לעמוד הקורס</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-start">
        {Object.entries(coursesBySemester)
          .sort(([semA], [semB]) => parseInt(semA) - parseInt(semB))
          .map(([semester, courses]) => (
            <div key={semester} className="flex flex-col items-center p-2 border rounded-lg bg-card/50 dark:bg-card/30 w-full space-y-4">
              <h2 className="text-xl font-semibold mb-0 border-b pb-1 w-full text-center flex-shrink-0">
                {parseInt(semester) === 8 ? 'כלי עזר' : `סמסטר ${semester}`}
              </h2>

              <div
                className="grid w-full gap-4"
                style={{
                  gridTemplateRows: `repeat(${maxCourses}, ${courseRowHeight})` // Corrected template literal
                }}
              >
                {courses.map((course, index) => {
                  // Conditionally render icon if available
                  const IconComponent = course.icon ? Icons[course.icon] : null;

                  return (
                    <div
                      key={`${course.name}-${course.number}`}
                      className="h-full"
                      style={{ gridRow: index + 1 }}
                    >
                      {/* Render logic based on the dynamically updated 'exists' and 'slug' */}
                      {course.exists && course.slug ? (
                        <Link href={course.slug} className="block w-full group h-full flex flex-col">
                          <Button
                            variant="default"
                            className="w-full h-auto py-2 px-2 mb-1 whitespace-normal text-xs sm:text-sm flex flex-col items-center justify-center text-center flex-grow text-white"
                            style={{ backgroundColor: '#FF8C00' }}
                          >
                            {IconComponent && <IconComponent className="h-4 w-4 mb-1" />} {/* Display icon if exists */}
                            <span className="font-semibold text-sm mb-1">{course.number}</span>
                            <span className="leading-tight">{course.name}</span>
                          </Button>
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5 self-center flex-shrink-0"
                            style={{ backgroundColor: '#1E90FF', color: '#FFFFFF' }}
                          >
                            {course.isInternalLink ? (parseInt(semester) === 8 ? 'כלי עזר' : 'קיים קורס') : 'קישור חיצוני'}
                          </Badge>
                        </Link>
                      ) : (
                        <div className="w-full group h-full flex flex-col">
                          <Button
                            variant="outline"
                            disabled
                            className="w-full h-auto py-2 px-2 mb-1 whitespace-normal text-xs sm:text-sm flex flex-col items-center justify-center text-center border-dashed disabled:opacity-60 flex-grow text-white"
                            style={{ backgroundColor: '#FF8C00' }}
                          >
                            {IconComponent && <IconComponent className="h-4 w-4 mb-1 opacity-50" />} {/* Display disabled icon */}
                            <span className="font-semibold text-sm mb-1">{course.number}</span>
                            <span className="leading-tight">{course.name}</span>
                          </Button>
                          <Badge variant="outline" className="border-dashed text-muted-foreground group-hover:bg-muted/50 text-xs px-1.5 py-0.5 self-center flex-shrink-0">עדיין לא קיים</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
      <p className="text-center text-muted-foreground mt-10 text-sm">
        הערה: זוהי הצגה סמסטריאלית של הקורסים. קשרי קדם אינם מוצגים ויזואלית.
      </p>
    </div>
  );
}
