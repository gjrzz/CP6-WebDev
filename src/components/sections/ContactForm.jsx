import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Field from '@/components/ui/Field';
import { useSendMessage } from '@/hooks/useSendMessage';
import { contactSchema } from '@/lib/contactSchema';
import { CONTACT } from '@/lib/content';

const EMPTY = { name: '', email: '', message: '', website: '' };

// Formulário do verso do cartão. `active` = cartão virado: o foco vai para o primeiro campo.
export default function ContactForm({ active = true }) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema), defaultValues: EMPTY });
  const { mutate, isPending, isSuccess, isError, reset: resetStatus } = useSendMessage();

  useEffect(() => {
    if (active) setFocus('name');
  }, [active, setFocus]);

  const onSubmit = (data) => mutate(data, { onSuccess: () => reset(EMPTY) });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => (isSuccess || isError) && resetStatus()}
      noValidate
      className="flex flex-col gap-5"
    >
      <Field
        label="Nome"
        tone="page"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Field
        label="E-mail"
        tone="page"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Field
        label="Mensagem"
        tone="page"
        multiline
        error={errors.message?.message}
        {...register('message')}
      />

      {/* Honeypot: fora da tela e fora da ordem de foco; só robô preenche */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Site
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <Button type="submit" variant="ink" loading={isPending} className="self-start">
        {isPending ? 'Enviando…' : 'Enviar'}
      </Button>

      {isSuccess && (
        <p role="status" className="text-page-ink text-sm">
          {CONTACT.success}
        </p>
      )}
      {isError && (
        <p role="alert" className="text-page-error text-sm">
          {CONTACT.error}
        </p>
      )}
    </form>
  );
}
