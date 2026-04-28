'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Config } from '../config';

// เพิ่มส่วนนี้เพื่อรับค่าจาก layout
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ... (โค้ด initials, isActive, fetch profile, signOut เดิมของคุณคงไว้ทั้งหมด) ...
  const initials = useMemo(() => {
    if (!name) return 'U';
    return name.split(' ').filter(Boolean).map((w) => w[0]?.toUpperCase()).slice(0, 2).join('');
  }, [name]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      const token = localStorage.getItem('token');
      if (!token) { router.replace('/member/signin'); return; }
      try {
        const url = `${Config.apiUrl}/member/info`;
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal });
        setName(res.data?.name ?? '');
      } catch (err: any) {
        if (axios.isCancel?.(err)) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('token');
          router.replace('/member/signin');
        }
      } finally { setLoading(false); }
    };
    run();
    return () => controller.abort();
  }, [router]);

  const signOut = async () => {
    const res = await Swal.fire({ title: 'Sign out', text: 'จะออกจากระบบจริงๆ หรออ? 🥹', icon: 'question', showCancelButton: true });
    if (!res.isConfirmed) return;
    localStorage.removeItem('token');
    router.replace('/member/signin');
  };

  const menus = [
    { href: '/backoffice/home/todo', label: '✏️ บันทึกงาน', icon: 'fa-list-check' },
    { href: '/backoffice/home/dashboard', label: '📁 รายงานสรุป', icon: 'fa-chart-pie' },
  ] as const;

  return (
    <aside className={`
      fixed inset-y-0 left-0 h-screen w-[220px] bg-gray-900 text-gray-200 border-r border-gray-800 flex flex-col z-[60]
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0  /* จอคอมให้โชว์ตลอดเวลา */
    `}>
      <div className="px-4 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-500/20 grid place-items-center">👽</div>
            <div className="font-semibold text-gray-100">Hello world 🛸</div>
          </div>
          {/* ปุ่มปิดเมนูบนมือถือ */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Profile compact */}
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700">
            <img src="/images/profile.jpg" alt="Profile" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <div className="truncate text-gray-100">{loading ? '...' : name || '-'}</div>
            <div className="text-gray-400">ยินดีต้อนรับ 🌤️</div>
          </div>
          <button onClick={() => router.push('/backoffice/home/profile')} className="text-[10px] text-sky-300">Edit</button>
        </div>

        <nav className="space-y-1">
          {menus.map((m) => (
            <Link key={m.href} href={m.href} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${isActive(m.href) ? 'bg-sky-500/15 text-sky-200' : 'text-gray-300 hover:bg-gray-800'}`}>
              <span className="font-medium">{m.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-2 border-t border-white/10">
          <button onClick={signOut} className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-400/50 py-2 text-sm text-red-300">Logout</button>
        </div>
      </div>
    </aside>
  );
}