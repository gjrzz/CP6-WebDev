import ScrollStroke from '@/components/ui/ScrollStroke';
import Sticker from '@/components/decor/Sticker';
import TapeBand from '@/components/decor/TapeBand';

// Rabiscos à mão que se desenham com a rolagem (ver ScrollStroke), cada um com a sua
// posição na faixa, o tamanho da legenda e o tamanho do traço
const scribbles = {
  // Seta torta apontando para a seção de baixo
  arrow: {
    viewBox: '0 0 120 140',
    d: 'M20 10 C 70 20, 95 55, 70 90 S 40 120, 62 132 M48 118 L62 132 L74 114',
    place: 'top-1/2 left-[12%]',
    label: 'text-xl',
    stroke: 'h-24 w-24',
  },
  // Espiral solta, como quem testa a caneta. Sobe para o vão logo abaixo da folha da
  // bancada, do lado direito (o "grind" fica à esquerda)
  loop: {
    viewBox: '0 0 140 90',
    d: 'M10 60 C 30 10, 70 10, 60 45 S 30 80, 55 70 S 110 20, 130 40',
    place: '-top-24 right-[20%]',
    label: 'text-5xl',
    stroke: 'h-28 w-44',
  },
};

// Faixa entre duas seções: fita (opcional), adesivos nas margens e um rabisco com legenda.
// Os adesivos e o rabisco ficam em posição absoluta e só aparecem no desktop, onde há
// margem livre; não ocupam espaço no layout.
export default function SectionBreak({ tape, stickers = [], scribble }) {
  return (
    // Sem fita, uma altura mínima dá espaço para os adesivos entre as seções
    <div aria-hidden="true" className={`pointer-events-none relative ${tape ? '' : 'h-24'}`}>
      {tape && <TapeBand {...tape} />}

      <div className="absolute inset-0 mx-auto hidden max-w-7xl lg:block">
        {stickers.map(({ side, ...sticker }, index) => (
          <div
            key={sticker.text}
            className={`absolute ${side === 'left' ? 'left-4' : 'right-16'}`}
            style={{ top: `${-20 + index * 30}%` }}
          >
            <Sticker {...sticker} />
          </div>
        ))}

        {scribble && (
          <div
            className={`text-accent absolute flex items-start gap-2 ${scribbles[scribble.shape].place}`}
          >
            <span className={`font-brush -rotate-6 ${scribbles[scribble.shape].label}`}>
              {scribble.label}
            </span>
            <ScrollStroke
              viewBox={scribbles[scribble.shape].viewBox}
              d={scribbles[scribble.shape].d}
              className={scribbles[scribble.shape].stroke}
              strokeWidth={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}
