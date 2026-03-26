"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Layout,
  ImageIcon,
  Video,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/builder", label: "Конструктор", icon: Layout },
  { href: "/generator", label: "Генератор банера", icon: ImageIcon },
  { href: "/video", label: "Генератор видео", icon: Video },
  { href: "/created", label: "Созданные", icon: FolderOpen },
];

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/80">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-white hover:text-[var(--brand-orange)] transition-colors"
          >
            GenNiga
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-white/10 text-white"
                    : "text-[#a1a1a6] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 -mr-2 rounded-lg text-[#a1a1a6] hover:text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#161616]">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-white/10 text-white"
                      : "text-[#a1a1a6] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      <footer className="border-t border-white/10 py-4 text-center text-sm text-[#6b6b70]">
        GenNiga — баннеры для Яндекс.Директ
      </footer>
    </div>
  );
}

