import Picture from '@/components/ui/Picture';
import Reveal from '@/components/ui/Reveal';
import ScrollStroke from '@/components/ui/ScrollStroke';
import StampedWord from '@/components/ui/StampedWord';
import { WORKBENCH } from '@/lib/content';

// Rótulo pequeno de cada bloco da folha
function Label({ children }) {
  return (
    <h3 className="text-page-muted mb-3 font-mono text-xs tracking-[0.3em] uppercase">
      {children}
    </h3>
  );
}

function Stack() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {WORKBENCH.stack.map((group) => (
        <div key={group.label}>
          <Label>{group.label}</Label>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="border-page-ink/30 rounded-sm border px-2 py-0.5 font-mono text-xs"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Cargo/curso, onde e quando (o período só aparece quando preenchido no content.js)
function Entry({ title, place, period, children }) {
  return (
    <li>
      <p className="font-display text-xl italic">
        {title} <span className="text-page-muted not-italic">· {place}</span>
      </p>
      {period && <p className="text-page-muted font-mono text-xs">{period}</p>}
      {children}
    </li>
  );
}

function Experience() {
  return (
    <div>
      <Label>Experiência</Label>
      <ul className="flex flex-col gap-5">
        {WORKBENCH.experience.map((job) => (
          <Entry key={job.company} title={job.role} place={job.company} period={job.period}>
            <ul className="text-page-muted mt-2 flex flex-col gap-1 text-sm">
              {job.highlights.map((line) => (
                <li key={line} className="before:mr-2 before:content-['—']">
                  {line}
                </li>
              ))}
            </ul>
          </Entry>
        ))}
      </ul>
    </div>
  );
}

function Background() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <Label>Formação</Label>
        <ul>
          {WORKBENCH.education.map((item) => (
            <Entry key={item.course} title={item.course} place={item.school} period={item.period} />
          ))}
        </ul>
      </div>
      <div>
        <Label>Certificação</Label>
        <ul className="text-sm">
          {WORKBENCH.certifications.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Workbench() {
  const { photo, words } = WORKBENCH;

  return (
    <section
      id="bancada"
      aria-labelledby="bancada-titulo"
      className="below-fold w-full overflow-x-clip"
      style={{ containIntrinsicSize: 'auto 1500px' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <h2 id="bancada-titulo" className="font-display mb-8 text-3xl italic">
          Bancada
        </h2>

        {/* No desktop, a folha fica sobre a foto do tapete; no celular, só a folha */}
        <div className="relative lg:overflow-hidden lg:rounded-3xl lg:px-16 lg:py-20">
          <div className="hidden lg:block">
            <Picture
              name={photo.name}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1152px) 1088px, 100vw"
              cover
            />
          </div>

          {/* Folha em CSS: cor de papel fixa nos dois temas, levemente torta sobre o tapete */}
          <Reveal
            className="bg-page-paper text-page-ink relative mx-auto flex max-w-2xl flex-col gap-10 rounded-sm p-6 shadow-2xl sm:p-10"
            style={{ rotate: '-1.2deg' }}
          >
            <div>
              <p className="text-[clamp(2.5rem,8vw,4.5rem)] leading-tight">
                {words.map((text, index) => (
                  <StampedWord key={text} text={text} delay={index * 0.35} />
                ))}
              </p>
              <ScrollStroke
                viewBox="0 0 300 24"
                d="M4 16 C 60 6, 120 22, 180 12 S 270 8, 296 14"
                className="text-page-highlight mt-2 h-6 w-3/4"
                strokeWidth={5}
              />
            </div>
            <Stack />
            <Experience />
            <Background />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
