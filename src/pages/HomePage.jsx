import Hero from '@/components/sections/Hero';
import ProjectsNotebook from '@/components/sections/ProjectsNotebook';
import Workbench from '@/components/sections/Workbench';
import ContactCard from '@/components/sections/ContactCard';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsNotebook />
      <Workbench />
      <ContactCard />
    </>
  );
}
