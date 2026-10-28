import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ProjectCard from '@/components/ui/ProjectCard';

const project = {
  name: 'meu-app',
  description: 'Gerenciador de tarefas',
  language: 'JavaScript',
  updatedAt: '2026-10-12T15:00:00Z',
};

function renderCard(overrides = {}) {
  render(
    <MemoryRouter>
      <ProjectCard project={{ ...project, ...overrides }} />
    </MemoryRouter>,
  );
}

describe('ProjectCard', () => {
  it('exibe nome, descrição, linguagem e data de atualização em pt-BR', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: 'meu-app' })).toBeInTheDocument();
    expect(screen.getByText('Gerenciador de tarefas')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('12 de out. de 2026')).toHaveAttribute(
      'datetime',
      '2026-10-12T15:00:00Z',
    );
  });

  it('leva para a página do projeto', () => {
    renderCard();
    expect(screen.getByRole('link', { name: 'meu-app' })).toHaveAttribute(
      'href',
      '/projetos/meu-app',
    );
  });

  it('mostra um texto padrão quando o repositório não tem descrição', () => {
    renderCard({ description: null, language: null });
    expect(screen.getByText('Sem descrição.')).toBeInTheDocument();
  });
});
