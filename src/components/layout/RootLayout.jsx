import { Outlet } from 'react-router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { useTheme } from '@/hooks/useTheme';
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/links';

export default function RootLayout() {
  useScrollToHash();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        name="Gabriel Juarez"
        links={NAV_LINKS}
        actions={<ThemeToggle theme={theme} onToggle={toggleTheme} />}
      />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer links={SOCIAL_LINKS} />
    </div>
  );
}
