---
name: component
description: Cria um componente React seguindo a arquitetura e a nomenclatura do projeto. Use quando o pedido for criar um componente, ex. "/component ProjectCard".
---

# Novo componente

1. **Classifique** o componente pela regra de `docs/architecture.md`:
   - genérico, recebe tudo por props → `src/components/ui/`
   - estrutura comum das páginas → `src/components/layout/`
   - bloco grande da home → `src/components/sections/`
   - tela de uma rota → `src/pages/` (sufixo `Page`)
2. **Verifique** se já existe algo parecido em `components/ui` para estender em vez de duplicar.
3. **Crie** o arquivo em PascalCase `.jsx`, com `export default function Nome(props)`.
   - Sem `fetch`, sem Supabase e sem `useQuery` dentro de `ui/`: dados chegam por props.
   - Estilo com Tailwind e tokens (`ink`, `paper`, `muted`, `accent`).
   - Aceite `className` para composição quando fizer sentido.
   - Imagens com `width`, `height`, `alt` e `loading="lazy"` (exceto acima da dobra).
   - Animação com `motion/react`, só `transform` e `opacity`, respeitando `useReducedMotion`.
4. **Acessibilidade:** elementos clicáveis são `<button>` ou `<a>`, foco visível, `aria-label` quando não houver texto.
5. Se o componente tiver comportamento (estado, validação, interação), crie `Nome.test.jsx` ao lado.
6. Rode `npm run lint` e `npm test`.
