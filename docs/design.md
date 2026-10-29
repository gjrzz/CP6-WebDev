# Direção visual

## Conceito

Portfólio editorial de fundo escuro, com **objetos reais fotografados** como metáforas e uma estética de **gráfico de shape de skate / sticker / pichação**. Referência principal: kyoosangchoi.com (estrutura e narrativa), adaptada para um IT Analyst e desenvolvedor que anda de skate.

## Narrativa da home (de cima para baixo)

1. **Hero:** frase tipográfica montada com estilos mistos — "Gabriel is a São Paulo-based IT Analyst and developer, who builds tools, automations and systems." Cargo na vertical. No centro, uma foto que troca em crossfade (skate, trabalho, setup).
2. **Caderno / shape com stickers:** objeto coberto de adesivos. Ao clicar, abre e mostra os projetos vindos do GitHub (os destaques primeiro). Cada projeto leva a `/projetos/:slug`.
3. **Bancada:** folha de papel sobre um blueprint azul (escurecido para conversar com o fundo), onde palavras são "carimbadas" letra por letra, cada letra numa fonte diferente (gótica, bubble, pincel), e o traço aparece no scroll. Mostra stack e experiência.
4. **Contato:** mão segurando um cartão "Let's build something". Ao clicar, o cartão vira e mostra o formulário.
5. **Rodapé:** links em formato de path (`/github/`, `/in/`, `/mail/`, `/cv/`).

## Tipografia

Mistura proposital de famílias por palavra, como letreiro de skate: uma serifada de display, uma gótica (ex.: UnifrakturMaguntia), uma bubble (ex.: Rubik Bubbles), uma de pincel (ex.: Permanent Marker) e uma mono para detalhes. Carregue só os pesos usados, com `font-display: swap`.

## Cores

Tokens em `src/styles/index.css`: `ink` (fundo), `paper` (texto/papel), `muted`, `accent` (amarelo). As fotos trazem o resto da cor.

## Animação

- Biblioteca: Motion (`motion/react`).
- Padrões: entrada no scroll (`whileInView` com `opacity` + `y`), stagger nas letras, flip 3D com `rotateY` no cartão e no caderno, `stroke-dashoffset` nos traços SVG.
- Anime **apenas `transform` e `opacity`**.
- Com `prefers-reduced-motion: reduce`, tudo aparece já no estado final (use `useReducedMotion`).
- Sem WebGL/partículas em tela cheia: custo alto no Lighthouse mobile.

## Imagens

- Fotos próprias, recortadas (fundo removido), exportadas em **WebP com transparência** (AVIF quando couber), em 2 tamanhos (`srcset`).
- Sempre com `width`, `height` e `alt`. Abaixo da dobra: `loading="lazy"`. A imagem principal do hero: `fetchpriority="high"`.
