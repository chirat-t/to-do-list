'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  
  { href: '/backoffice/home/dashboard', label: 'Dashboard' },
  
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <header
      className="
        w-full h-14 border-b border-[#1E293B]
        bg-gray-900 backdrop-blur-md
        text-[#E6E9EF] shadow-[0_2px_8px_rgba(0,0,0,0.4)]
        sticky top-0 z-50
      "
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-14 items-center justify-between">
          {/* โลโก้ / ชื่อระบบ */}
          <div className="font-semibold text-lg tracking-tight text-[#E6E9EF] select-none">
            🤴🏻 My Hero Day 🚀🎯
          </div>

          {/* เมนูนำทาง */}
          <nav className="flex items-center gap-1">
            {items.map((it) => {
              const active = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${active
                      ? 'bg-[#1E293B]/70 text-[#DDE9FF] shadow-inner'
                      : 'text-[#9AA6B2] hover:text-[#E6E9EF] hover:bg-[#1E293B]/40'}
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9AA6B2]/40
                  `}
                >
                  {active && (
                    <span
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#9AA6B2]"
                      aria-hidden
                    />
                  )}
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
