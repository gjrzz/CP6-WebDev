import { useTimecode } from '@/hooks/useTimecode';

// Cantoneiras de enquadramento (um "L" em cada canto)
const corners = [
  'top-3 left-3 border-t-2 border-l-2',
  'top-3 right-3 border-t-2 border-r-2',
  'bottom-3 left-3 border-b-2 border-l-2',
  'bottom-3 right-3 border-b-2 border-r-2',
];

function Battery() {
  return (
    <span className="inline-flex items-center">
      <span className="border-page-paper flex h-2.5 w-5 items-center border p-px">
        <span className="bg-page-paper h-full w-3/4" />
      </span>
      <span className="bg-page-paper h-1 w-0.5" />
    </span>
  );
}

// Visor de filmadora de skate dos anos 2000 (tipo VX1000) por cima das fotos do hero:
// cantoneiras, REC piscando, timecode rodando, bateria e vinheta. Só decoração.
// As marcas usam a cor clara fixa (page-paper): ficam sobre a foto, não sobre o fundo do tema.
export default function Viewfinder({ running = true }) {
  const timecode = useTimecode(running);

  return (
    <div
      aria-hidden="true"
      className="text-page-paper pointer-events-none absolute inset-0 z-10 font-mono text-[10px] tracking-widest uppercase [text-shadow:0_1px_2px_rgb(0_0_0/0.8)] sm:text-xs"
    >
      {/* Vinheta: bordas escurecidas como a lente da filmadora */}
      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgb(0_0_0/0.55)]" />

      {corners.map((position) => (
        <span
          key={position}
          className={`border-page-paper absolute size-5 sm:size-6 ${position}`}
        />
      ))}

      <div className="absolute top-5 left-8 flex items-center gap-1.5 sm:left-10">
        <span className="bg-rec motion-safe:animate-rec size-2 rounded-full" />
        rec
      </div>
      <div className="absolute top-5 right-8 flex items-center gap-2 sm:right-10">
        sp
        <Battery />
      </div>
      <div className="absolute bottom-5 left-8 tabular-nums sm:left-10">{timecode}</div>
    </div>
  );
}
