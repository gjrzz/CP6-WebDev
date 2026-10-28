-- Esquema inicial do portfólio. Rode no SQL Editor do Supabase.

-- Mensagens do formulário de contato
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 20 and 2000),
  answered boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Visitante (anônimo) só pode inserir
create policy "visitante envia mensagem"
  on public.messages for insert
  to anon, authenticated
  with check (answered = false);

-- Dono autenticado lê e marca como respondida
create policy "dono lê mensagens"
  on public.messages for select
  to authenticated
  using (true);

create policy "dono atualiza mensagens"
  on public.messages for update
  to authenticated
  using (true)
  with check (true);

-- Projetos em destaque na home (referência pelo nome do repositório no GitHub)
create table if not exists public.featured_projects (
  repo_name text primary key,
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.featured_projects enable row level security;

create policy "todos leem destaques"
  on public.featured_projects for select
  to anon, authenticated
  using (true);

create policy "dono gerencia destaques"
  on public.featured_projects for all
  to authenticated
  using (true)
  with check (true);

-- Permissões explícitas (o projeto foi criado sem expor tabelas automaticamente).
-- O RLS acima filtra as linhas; os GRANTs abaixo definem quais operações cada papel pode tentar.
grant insert on public.messages to anon, authenticated;
grant select, update on public.messages to authenticated;
grant select on public.featured_projects to anon, authenticated;
grant insert, update, delete on public.featured_projects to authenticated;
-- Atenção: o visitante não tem SELECT em messages, então o insert no front NÃO pode usar .select() depois.

-- Desative o cadastro público em Authentication > Providers > Email (Allow new users to sign up = off)
-- e crie o seu usuário em Authentication > Users. Assim "authenticated" = só você.
