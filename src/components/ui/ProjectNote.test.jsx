import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ProjectNote from '@/components/ui/ProjectNote';

const project = {
  name: 'meu-app',
  description: 'Gerenciador de tarefas',
  language: 'JavaScript',
  updatedAt: '2026-10-12T15:00:00Z',
};

function renderNote(props = {}) {
  render(
    <MemoryRouter>
      <ProjectNote project={project} {...props} />
    </MemoryRouter>,
  );
}

describe('ProjectNote', () => {
  it('escreve nome, descrição, linguagem e data, com link para a página do projeto', () => {
    renderNote();
    expect(screen.getByRole('link', { name: 'meu-app' })).toHaveAttribute(
      'href',
      '/projetos/meu-app',
    );
    expect(screen.getByText('Gerenciador de tarefas')).toBeInTheDocument();
    expect(screen.getByText(/JavaScript ·/)).toHaveTextContent('JavaScript · 12 de out. de 2026');
  });

  it('marca o destaque só quando pedido', () => {
    renderNote();
    expect(screen.queryByText('destaque')).not.toBeInTheDocument();

    renderNote({ featured: true });
    expect(screen.getByText('destaque')).toBeInTheDocument();
  });
});
