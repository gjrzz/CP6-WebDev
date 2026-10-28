import { Navigate, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { PageSpinner } from '@/components/layout/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLogin } from '@/hooks/useLogin';
import { loginSchema } from '@/lib/loginSchema';
import { InvalidCredentialsError } from '@/services/auth';

export default function LoginPage() {
  useDocumentTitle('Entrar · Gabriel Juarez');
  const { session, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Volta para onde o dono tentou ir antes de ser mandado ao login
  const from = location.state?.from?.pathname ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const { mutate, isPending, error } = useLogin();

  if (loading) return <PageSpinner label="Verificando acesso" />;
  if (session && !isPending) return <Navigate to={from} replace />;

  const onSubmit = (data) => mutate(data, { onSuccess: () => navigate(from, { replace: true }) });

  return (
    <section className="mx-auto w-full max-w-sm px-4 py-24">
      <h1 className="font-display mb-8 text-4xl italic">Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Field
          label="E-mail"
          type="email"
          autoComplete="username"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {error && (
          <p role="alert" className="text-danger text-sm">
            {error instanceof InvalidCredentialsError
              ? 'e-mail ou senha incorretos'
              : 'Não foi possível entrar agora. Tente de novo em instantes.'}
          </p>
        )}
        <Button type="submit" loading={isPending} className="self-start">
          {isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </section>
  );
}
