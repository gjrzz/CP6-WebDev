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

// Movimento de "escrevendo": vai e vem curto com a ponta, depois para
const writing = {
  x: [0, -10, 6, -12, 4, -8, 0],
  y: [0, 4, -3, 5, -2, 3, 0],
  rotate: [0, -4, 3, -5, 2, -3, 0],
};

// Caneta largada no canto do cartão. Entra deslizando e girando quando a seção aparece;
// quando o cartão vira para o formulário, "escreve" por alguns segundos.
function Pen({ writingNow, reduced }) {
  const { pen } = CONTACT;
  // Contorno claro de 1px: a caneta é preta e sumiria no fundo escuro
  const image = (
    <Picture
      name={pen.name}
      alt=""
      width={pen.width}
      height={pen.height}
      sizes="15rem"
      className="w-full [filter:drop-shadow(0_0_1px_rgb(245_245_240/0.6))]"
    />
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-20 bottom-24 z-10 w-48 sm:-right-28 sm:w-60"
    >
      {reduced ? (
        image
      ) : (
        <m.div
          initial={{ opacity: 0, x: 200, rotate: 60 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 140, damping: 14 }}
        >
          <m.div
            animate={writingNow ? writing : { x: 0, y: 0, rotate: 0 }}
            transition={
              writingNow ? { duration: 1.4, ease: 'easeInOut', repeat: 1, delay: 0.6 } : undefined
            }
          >
            {image}
          </m.div>
        </m.div>
      )}
    </div>
  );
}

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

          <Pen writingNow={flipped} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
