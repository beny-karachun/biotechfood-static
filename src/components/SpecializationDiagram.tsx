import fs from 'fs';
import path from 'path';
import AnimatedSpecializationGrid from './AnimatedSpecializationGrid';

export interface SpecializationCourse {
  name: string;
  number: string;
  marked?: boolean;
  exists?: boolean;
  hasContent?: boolean;
  slug?: string | null;
}

export interface SpecializationTrack {
  id: number;
  title: string;
  titleEn: string;
  theory: SpecializationCourse[];
  research: SpecializationCourse[];
  theoryNote?: boolean;
  researchNote?: boolean;
}

const specializationTracks: SpecializationTrack[] = [
  {
    id: 1,
    title: 'מגמה לביוטכנולוגיה יישומית',
    titleEn: 'Applied Biotechnology',
    theory: [
      { number: '276413', name: 'אימונולוגיה' },
      { number: '066513', name: 'ביוטכנולוגיה של תאים אנימליים' },
      { number: '064508', name: 'מעבדה בריאקטורים ביולוגיים' },
    ],
    research: [
      { number: '066516', name: 'מעבדה בביוטכנולוגיה מולקולרית' },
      { number: '066332', name: 'ביו-ננו היברידים וסנסורים' },
      { number: '064119', name: 'תכן מפעלים' },
      { number: '066421', name: 'המיקרוביום' },
      { number: '066529', name: 'ביואינפורמטיקה של סרטן' },
      { number: '066533', name: 'לקראת תאים סינתטיים' },
      { number: '066517', name: 'טכנולוגיות גנטיות מתקדמות' },
    ],
  },
  {
    id: 2,
    title: 'מגמה לביוטכנולוגיה רפואית',
    titleEn: 'Medical Biotechnology',
    theory: [
      { number: '276413', name: 'אימונולוגיה' },
      { number: '066333', name: 'ביו-רוקחות' },
      { number: '066121', name: 'דיאגנוסטיקה רפואית' },
    ],
    research: [
      { number: '066516', name: 'מעבדה בביוטכנולוגיה מולקולרית' },
      { number: '066334', name: 'מיקרו-ננו אנקפסולציה לשחרור מבוקר' },
      { number: '064508', name: 'מעבדה בריאקטורים ביולוגיים' },
      { number: '066526', name: 'ביולוגיה סינתטית' },
      { number: '066329', name: 'אמולסיות במזון ובביוטכנולוגיה' },
      { number: '066513', name: 'ביוטכנולוגיה של תאים אנימליים' },
      { number: '066529', name: 'ביואינפורמטיקה של סרטן' },
    ],
  },
  {
    id: 3,
    title: 'מגמת ביוטכנולוגיה חישובית',
    titleEn: 'Computational Biotechnology',
    theory: [
      { number: '066529', name: 'ביואינפורמטיקה של סרטן' },
      { number: '066532', name: 'אנליזה של נתוני עתק' },
      { number: '066121', name: 'דיאגנוסטיקה רפואית' },
    ],
    research: [
      { number: '066531', name: 'סמינר בביוטכנולוגיה חישובית' },
      { number: '236523', name: 'מבוא לביואינפורמטיקה', marked: true },
      { number: '134158', name: 'שיטות בביואינפורמטיקה למדעי החיים', marked: true },
      { number: '066526', name: 'ביולוגיה סינתטית' },
      { number: '066421', name: 'המיקרוביום' },
    ],
    researchNote: true,
  },
  {
    id: 4,
    title: 'מגמת הנדסת מזון ובריאות',
    titleEn: 'Food Engineering & Health',
    theory: [
      { number: '276413', name: 'אימונולוגיה' },
      { number: '066605', name: 'תזונה מונעת, היבטים בריאותיים', marked: true },
      { number: '066614', name: 'תזונה אישית', marked: true },
      { number: '064253', name: 'טכנולוגיות מתקדמות בהנדסת מזון וביוטכנולוגיה' },
    ],
    research: [
      { number: '064119', name: 'תכן מפעלים' },
      { number: '064254', name: 'מעבדה בטכנולוגיות מתקדמות' },
      { number: '066230', name: 'הערכה באמצעות החושים' },
      { number: '066255', name: 'מכניקה של חומרים רכים' },
      { number: '066329', name: 'אמולסיות במזון ובביוטכנולוגיה' },
      { number: '066334', name: 'מיקרו-ננו אנקפסולציה לשחרור מבוקר' },
      { number: '066418', name: 'מיקרוביולוגיה של פתוגנים' },
      { number: '066421', name: 'המיקרוביום' },
      { number: '066215', name: 'טכנולוגיה של מוצרי חלב' },
    ],
    theoryNote: true,
  },
  {
    id: 5,
    title: 'מגמת חדשנות וקיימות בהנדסת מזון',
    titleEn: 'Food Engineering Innovation & Sustainability',
    theory: [
      { number: '066217', name: 'אריזה וחיי מדף' },
      { number: '066252', name: 'מזון וקיימות' },
      { number: '064253', name: 'טכנולוגיות מתקדמות בהנדסת מזון וביוטכנולוגיה' },
    ],
    research: [
      { number: '064119', name: 'תכן מפעלים' },
      { number: '064254', name: 'מעבדה בטכנולוגיות מתקדמות' },
      { number: '066525', name: 'יזמות בהנדסת ביוטכנולוגיה ומזון' },
      { number: '066329', name: 'אמולסיות במזון ובביוטכנולוגיה' },
      { number: '064249', name: 'טכנולוגיות עיבוד תוצרת טרייה' },
      { number: '066230', name: 'הערכה באמצעות החושים' },
      { number: '064251', name: 'המדע מאחורי חלופות בשר' },
      { number: '064331', name: 'מערכי תקינה' },
    ],
  },
];

function sanitizeNameForPath(name: string): string {
  return name.replace(/\s+/g, '-').replace(/[`"'?*]/g, '');
}

async function processCourse(course: SpecializationCourse): Promise<SpecializationCourse> {
  const folderName = `${course.number}-${sanitizeNameForPath(course.name)}`;
  const coursePath = path.join(process.cwd(), 'public', 'courses', folderName);

  try {
    const files = await fs.promises.readdir(coursePath);
    return {
      ...course,
      exists: true,
      hasContent: files.some((file) => /\.(html|pdf)$/i.test(file)),
      slug: `/courses/${folderName}`,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Error checking specialization course folder ${folderName}:`, error);
    }

    return { ...course, exists: false, hasContent: false, slug: null };
  }
}

export default async function SpecializationDiagram() {
  const processedTracks = await Promise.all(
    specializationTracks.map(async (track) => ({
      ...track,
      theory: await Promise.all(track.theory.map(processCourse)),
      research: await Promise.all(track.research.map(processCourse)),
    })),
  );

  return <AnimatedSpecializationGrid tracks={processedTracks} />;
}
