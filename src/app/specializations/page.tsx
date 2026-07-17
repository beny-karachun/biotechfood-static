import type { Metadata } from 'next';
import SpecializationDiagram from '@/components/SpecializationDiagram';

export const metadata: Metadata = {
  title: 'קורסי מגמות | TechnionPrep',
  description: 'קורסי חמש המגמות בהנדסת ביוטכנולוגיה ומזון בטכניון.',
};

export default function SpecializationsPage() {
  return (
    <section className="min-h-screen bg-background pb-12 pt-20 md:pt-24">
      <SpecializationDiagram />
    </section>
  );
}
