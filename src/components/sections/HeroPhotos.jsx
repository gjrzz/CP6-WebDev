import { m } from 'motion/react';
import Picture from '@/components/ui/Picture';
import Viewfinder from '@/components/decor/Viewfinder';
import { useCrossfade } from '@/hooks/useCrossfade';
import { useIdle } from '@/hooks/useIdle';
import { HERO } from '@/lib/content';

// Moldura com proporção fixa (HERO.frame): fotos de proporções diferentes ocupam o mesmo
// espaço, cortadas no ponto de `focus`, e a troca entre elas não mexe no layout
export default function HeroPhotos({ reduced }) {
  const { photos, frame } = HERO;
  // As outras fotos só entram quando o navegador fica ocioso (antes da 1ª troca, aos 3 s):
  // no carregamento, a banda fica para a 1ª foto, que é o LCP
  const idle = useIdle();
  // Com reduced motion, só a primeira foto, sem troca automática
  const shown = reduced || !idle ? photos.slice(0, 1) : photos;
  const index = useCrossfade(shown.length, { paused: reduced });

  return (
    <div
      className="relative w-72 overflow-hidden sm:w-96 lg:w-[min(34vw,32rem)]"
      style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
    >
      {shown.map((photo, i) => (
        <m.div
          key={photo.name}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1 }}
          aria-hidden={i !== index || undefined}
        >
          <Picture
            name={photo.name}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes={HERO.photoSizes}
            priority={i === 0}
            cover
            position={photo.focus}
          />
        </m.div>
      ))}
      {/* Visor de filmadora por cima das fotos; com reduced motion, REC aceso e timecode parado */}
      <Viewfinder running={!reduced} />
    </div>
  );
}
