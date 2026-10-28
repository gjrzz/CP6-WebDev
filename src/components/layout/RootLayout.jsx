import { Outlet } from 'react-router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/links';

export default function RootLayout() {
  useScrollToHash();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header name="Gabriel Juarez" links={NAV_LINKS} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer links={SOCIAL_LINKS} />
    </div>
  );
}
