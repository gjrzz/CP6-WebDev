import { lazy, Suspense, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import Picture from '@/components/ui/Picture';
import Reveal from '@/components/ui/Reveal';
import { preloadContactServices } from '@/hooks/useSendMessage';
import { CONTACT } from '@/lib/content';

// O formulário (React Hook Form + Zod) fica fora do chunk inicial: só aparece depois do flip
const loadContactForm = () => import('@/components/sections/ContactForm');
const ContactForm = lazy(loadContactForm);

// As duas faces ocupam a mesma célula do grid, com a altura do formulário desde o início:
// carregá-lo no verso não muda o tamanho do cartão
const face =
  'bg-page-paper text-page-ink min-h-[34rem] rounded-2xl p-6 shadow-2xl [backface-visibility:hidden] [grid-area:1/1] sm:p-8';

function FormSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-8 pt-2">
      {['w-1/3', 'w-1/2', 'w-2/3'].map((width) => (
        <span
          key={width}
          className={`bg-page-ink/15 block h-0.5 ${width} motion-safe:animate-pulse`}
        />
      ))}
    </div>
  );
}

export default function ContactCard() {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  // Primeiro sinal de interesse (mouse, foco ou clique): baixa o formulário e os SDKs
  const [wanted, setWanted] = useState(false);
  const { photo } = CONTACT;

  const prepare = () => {
    if (wanted) return;
    setWanted(true);
    loadContactForm();
    preloadContactServices();
  };

  const flip = () => {
    prepare();
    setFlipped(true);
  };

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="w-full overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <h2 id="contato-titulo" className="font-display mb-8 text-3xl italic">
          Contato
        </h2>

        <div className="relative isolate mx-auto max-w-md pb-40">
          {/* A mão sobe de baixo ao entrar na tela, atrás do cartão */}
          <Reveal y={120} className="absolute inset-x-[10%] bottom-0 -z-10">
            <Picture
              name={photo.name}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="360px"
              className="w-full"
            />
          </Reveal>

          {/* Flutua de leve até alguém interagir; o giro fica no filho */}
          <m.div
            animate={reduced || flipped ? { y: 0 } : { y: [0, -4, 0] }}
            transition={{
              duration: 3,
              repeat: reduced || flipped ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ y: 0 }}
            className="[perspective:1400px]"
          >
            <m.div
              initial={false}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid [transform-style:preserve-3d]"
            >
              {/* Frente: um botão que vira o cartão. `inert` tira a face escondida do foco. */}
              <button
                type="button"
                onClick={flip}
                onPointerEnter={prepare}
                onFocus={prepare}
                aria-expanded={flipped}
                inert={flipped}
                className={`${face} focus-visible:outline-accent flex flex-col items-start justify-between text-left focus-visible:outline-2 focus-visible:outline-offset-4`}
              >
                <span className="font-display text-4xl leading-tight italic sm:text-5xl">
                  {CONTACT.front}
                </span>
                <span className="text-page-muted font-mono text-xs">
                  {CONTACT.hint}
                  <span className="sr-only"> — abrir formulário de contato</span>
                </span>
              </button>

              <div inert={!flipped} className={`${face} [transform:rotateY(180deg)]`}>
                {wanted && (
                  <Suspense fallback={<FormSkeleton />}>
                    <ContactForm active={flipped} />
                  </Suspense>
                )}
              </div>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
