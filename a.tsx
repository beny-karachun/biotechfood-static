'use client'; // Keep as client component for potential future interactivity

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Define the structure for course information based on the diagram
interface CourseInfo {
  name: string;
  number: number | string; // Use string for obscured numbers or '??'
  slug: string | null;
  exists: boolean;
  semester: number;
}

// Define course data based *exactly* on the NEW user-provided list
const courseData: CourseInfo[] = [
  // Semester 1
  { name: `חדוא 1מ`, number: 104018, slug: null, exists: false, semester: 1 },
  { name: `אלגברה לינארית מ`, number: 104019, slug: null, exists: false, semester: 1 },
  { name: `מבוא להנדסת ביוטכנולוגיה ומזון`, number: "064522", slug: null, exists: false, semester: 1 },
  { name: `ביולוגיה 1`, number: 134058, slug: null, exists: false, semester: 1 },
  { name: `יסודות הכימיה`, number: 124120, slug: null, exists: false, semester: 1 },

  // Semester 2
  { name: `חדוא 2מ`, number: 104022, slug: null, exists: false, semester: 2 },
  { name: `אנגלית טכנית מתקדמים ב`, number: 324033, slug: null, exists: false, semester: 2 },
  { name: `ביוכימיה ואנזימולוגיה`, number: 134019, slug: null, exists: false, semester: 2 },
  { name: `כימיה אורגנית`, number: 125801, slug: null, exists: false, semester: 2 },
  { name: `כימיה אנליטית`, number: 125101, slug: null, exists: false, semester: 2 },
  { name: `פיסיקה 1`, number: 114051, slug: null, exists: false, semester: 2 },

  // Semester 3
  { name: `מדר ח`, number: 104131, slug: null, exists: false, semester: 3 },
  { name: `פייתון`, number: 234128, slug: null, exists: false, semester: 3 },
  { name: `טכנולוגיה של מזון`, number: "064212", slug: "/websites/FoodTechnologyQuizzes/index.html", exists: true, semester: 3 }, // Exists
  { name: `מבוא לביוט מולקולרית`, number: "064523", slug: null, exists: false, semester: 3 },
  { name: `מסלולים מטבוליים`, number: 134113, slug: null, exists: false, semester: 3 },
  { name: `כימיה פיסיקלית`, number: 124510, slug: null, exists: false, semester: 3 },

  // Semester 4
  { name: `מדח מ`, number: 104228, slug: "/websites/PDEs/index.html", exists: true, semester: 4 }, // Exists (Mapped to PDEs)
  { name: `מכניקה של זורמים`, number: "064115", slug: null, exists: false, semester: 4 },
  { name: `מיקרוביולוגיה כללית`, number: "064419", slug: "/websites/microbiology website/index.html", exists: true, semester: 4 }, // Exists
  { name: `מעבדה במיקרוביולוגיה`, number: "064413", slug: null, exists: false, semester: 4 },
  { name: `כימיה של מזון`, number: "064322", slug: "/websites/foodchemistry/index.html", exists: true, semester: 4 }, // Linked to food chemistry index
  { name: `מעבדה בביוכימיה`, number: "064325", slug: null, exists: false, semester: 4 },
  { name: `פיסיקה 2`, number: 114052, slug: null, exists: false, semester: 4 },

  // Semester 5
  { name: `תופעות מעבר חום`, number: "064117", slug: null, exists: false, semester: 5 },
  { name: `ביוטכנולוגיה מולקולרית`, number: "064507", slug: null, exists: false, semester: 5 },
  { name: `מיקרוביולוגיה של מזון`, number: "064420", slug: null, exists: false, semester: 5 },
  { name: `שיטות אנליטיות`, number: "064324", slug: null, exists: false, semester: 5 },
  { name: `מעבדה באנליזה`, number: "064326", slug: null, exists: false, semester: 5 },
  { name: `תרמודינמיקה`, number: "064106", slug: null, exists: false, semester: 5 },

  // Semester 6
  { name: `תופעות מעבר חומר`, number: "064118", slug: null, exists: false, semester: 6 },
  { name: `סטטיסטיקה`, number: "094481", slug: null, exists: false, semester: 6 },
  { name: `שיטות נומריות`, number: "064120", slug: null, exists: false, semester: 6 },
  { name: `מדע וטכנולוגיה של ביוחומרים`, number: "064250", slug: null, exists: false, semester: 6 },
  { name: `בחירת קורסי מגמות`, number: "??", slug: null, exists: false, semester: 6 },

  // Semester 7
  { name: `מעבדה בהנדסת תהליכים`, number: "064239", slug: null, exists: false, semester: 7 },
  { name: `תהליכי יסוד`, number: "064509", slug: null, exists: false, semester: 7 },
  { name: `תזונה`, number: "064615", slug: null, exists: false, semester: 7 },
  { name: `בחירת קורסי מגמות`, number: "??", slug: null, exists: false, semester: 7 },

  // כלי עזר
  { name: "טסטר לפייתון", number: "???", slug: null, exists: false, semester: 8 },
  { name: "ספרות משמעותיות", number: "???", slug: "/websites/significantdigits/index.html", exists: true, semester: 8 } // Added and linked
];


// Helper to group courses by semester
const coursesBySemester = courseData.reduce((acc, course) => {
  const semester = course.semester;
  if (!acc[semester]) {
    acc[semester] = [];
  }
  acc[semester].push(course);
  return acc;
}, {} as Record<number, CourseInfo[]>);

// Calculate the maximum number of courses in any semester (will now be 7)
const maxCourses = Object.values(coursesBySemester).reduce(
  (max, courses) => Math.max(max, courses.length),
  0
);

// Define the fixed height for each course row/box
const courseRowHeight = "112px"; // Keep as h-28

export default function CourseDiagramPage() {
  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-10">תרשים מקצועות חובה</h1>
      {/* Outer Grid for Semesters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 items-start">
        {Object.entries(coursesBySemester)
         .sort(([semA], [semB]) => parseInt(semA) - parseInt(semB))
         .map(([semester, courses]) => (
          // Semester Column
          (<div key={semester} className="flex flex-col items-center p-2 border rounded-lg bg-card/50 dark:bg-card/30 w-full space-y-4">
            {/* Updated Semester Header */}
            <h2 className="text-xl font-semibold mb-0 border-b pb-1 w-full text-center flex-shrink-0">
              {parseInt(semester) === 8 ? 'כלי עזר' : `סמסטר ${semester}`}
            </h2>
            {/* Inner Grid for Courses - Enforces uniform row heights */}
            <div
              className="grid w-full gap-4" // Grid gap handles spacing
              style={{
                gridTemplateRows: `repeat(${maxCourses}, ${courseRowHeight})` // Uses updated height
              }}
            >
              {/* Map ONLY the actual courses into the grid cells */}
              {courses.map((course, index) => (
                // Grid Cell Container for a Course - takes full height of the grid row
                (<div
                  key={course.name}
                  className="h-full" // Make div fill the grid row height
                  style={{ gridRow: index + 1 }} // Place course in the correct row (1-based)
                >
                  {course.exists && course.slug ? (
                    <Link href={course.slug} passHref legacyBehavior>
                      {/* Anchor fills the container, uses flex-col. ADDED target and rel */}
                      <a
                        className="block w-full group h-full flex flex-col"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Button: flex-grow makes it take available vertical space */}
                        <Button
                          variant="default"
                          className="w-full h-auto py-2 px-2 mb-1 whitespace-normal text-xs sm:text-sm flex flex-col items-center justify-center text-center flex-grow"
                        >
                          <span className="font-semibold text-sm mb-1">{course.number}</span>
                          <span className="leading-tight">{course.name}</span>
                        </Button>
                        {/* Badge: naturally stays at bottom */}
                        <Badge variant="secondary" className="bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100 group-hover:bg-green-300 dark:group-hover:bg-green-600 text-xs px-1.5 py-0.5 self-center flex-shrink-0">קיים קורס</Badge>
                      </a>
                    </Link>
                  ) : (
                     // Div fills the container, uses flex-col
                    (<div className="w-full group h-full flex flex-col">
                      {/* Button: flex-grow makes it take available vertical space */}
                      <Button
                        variant="outline"
                        disabled
                        className="w-full h-auto py-2 px-2 mb-1 whitespace-normal text-xs sm:text-sm flex flex-col items-center justify-center text-center border-dashed disabled:opacity-60 flex-grow"
                      >
                        <span className="font-semibold text-sm mb-1 text-muted-foreground/80">{course.number}</span>
                        <span className="leading-tight text-muted-foreground/80">{course.name}</span>
                      </Button>
                      {/* Badge: naturally stays at bottom */}
                      <Badge variant="outline" className="border-dashed text-muted-foreground group-hover:bg-muted/50 text-xs px-1.5 py-0.5 self-center flex-shrink-0">עדיין לא קיים</Badge>
                    </div>)
                  )}
                </div>)
              ))}\n              {/* Empty grid cells are created automatically by gridTemplateRows */}
            </div>
          </div>)
        ))}\n      </div>
      <p className="text-center text-muted-foreground mt-10 text-sm">
        הערה: זוהי הצגה סמסטריאלית של הקורסים. קשרי קדם אינם מוצגים ויזואלית.
      </p>
    </div>
  );
}
