import { lazy, Suspense, useRef } from 'react';
import { m, useReducedMotion } from 'motion/react';
import ContactHand from '@/components/sections/ContactHand';
import ContactPen from '@/components/sections/ContactPen';
import { useContactFlip } from '@/hooks/useContactFlip';
import { useHandoff } from '@/hooks/useHandoff';
import { CONTACT } from '@/lib/content';
import { EASE_OUT } from '@/lib/motion';

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
  const { flipped, wanted, prepare, flip } = useContactFlip(loadContactForm);

  // Entrega: mão e cartão sobem juntos com a rolagem e chegam ao lugar quando a seção
  // encosta no fim da tela. Depois de virado, o cartão fica parado para o formulário.
  const handoff = useRef(null);
  const { y, rotate, scale } = useHandoff(handoff);
  const settled = reduced || flipped;

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="below-fold w-full overflow-x-clip"
      style={{ containIntrinsicSize: 'auto 900px' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <h2 id="contato-titulo" className="font-display mb-8 text-3xl italic">
          Contato
        </h2>

        <div ref={handoff} className="relative isolate mx-auto max-w-md">
          <m.div
            style={settled ? { y: 0, rotate: 0, scale: 1 } : { y, rotate, scale }}
            className="origin-bottom-right"
          >
            {/* Flutua de leve até alguém interagir; o giro fica no filho */}
            <m.div
              animate={settled ? { y: 0 } : { y: [0, -4, 0] }}
              transition={{
                duration: 3,
                repeat: settled ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ y: 0 }}
              className="relative [perspective:1400px]"
            >
              <m.div
                initial={false}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT }}
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
              <ContactHand released={flipped} reduced={reduced} />
            </m.div>

            <ContactPen writingNow={flipped} reduced={reduced} />
          </m.div>

          {/* Espaço para o braço abaixo do cartão, proporcional à largura */}
          <div aria-hidden="true" className="aspect-[5/3]" />
        </div>
      </div>
    </section>
  );
}
