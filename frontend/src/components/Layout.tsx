import { Sidebar } from './Sidebar';
import { Hero } from './Hero';
import { ThemeSelector } from './ThemeSelector';

export function Layout() {
  return (
    <div className="app-shell relative flex h-full min-h-screen w-full">
      <div className="pointer-events-none fixed right-4 top-4 z-[1200]">
        <div className="pointer-events-auto">
          <ThemeSelector />
        </div>
      </div>
      <Sidebar />
      <Hero />
    </div>
  );
}
