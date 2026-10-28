import Hero from '@/components/sections/Hero';
import ProjectsNotebook from '@/components/sections/ProjectsNotebook';
import Workbench from '@/components/sections/Workbench';
import ContactCard from '@/components/sections/ContactCard';
import SectionBreak from '@/components/decor/SectionBreak';
import SkateProgress from '@/components/decor/SkateProgress';
import { DECOR } from '@/lib/content';

export default function HomePage() {
  const { tapes, stickers, scribbles } = DECOR;

  return (
    <>
      <SkateProgress />
      <Hero />
      <SectionBreak
        tape={{ words: tapes.caution, tone: 'caution' }}
        stickers={stickers.afterHero}
        scribble={{ shape: 'arrow', label: scribbles.toProjects }}
      />
      <ProjectsNotebook />
      <SectionBreak stickers={stickers.afterProjects} />
      <Workbench />
      <SectionBreak
        tape={{ words: tapes.masking, tone: 'masking', reverse: true }}
        stickers={stickers.beforeContact}
        scribble={{ shape: 'loop', label: scribbles.toContact }}
      />
      <ContactCard />
    </>
  );
}
