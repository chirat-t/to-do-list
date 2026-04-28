'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Config } from '../config';

export default function Sidebar() {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ===== helpers =====
  const initials = useMemo(() => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  }, [name]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  // ===== fetch profile =====
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/member/signin');
        return;
      }
      try {
        const url = `${Config.apiUrl}/member/info`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        setName(res.data?.name ?? '');
      } catch (err: any) {
        if (axios.isCancel?.(err) || err?.code === 'ERR_CANCELED') return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('token');
          router.replace('/member/signin');
        } else {
          Swal.fire({ title: 'error', text: (err as Error).message, icon: 'error' });
        }
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [router]);

  // ===== sign out =====
  const signOut = async () => {
    const res = await Swal.fire({
      title: 'Sign out',
      text: 'จะออกจากระบบจริงๆ หรออ? 🥹',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      focusCancel: true,
    });
    if (!res.isConfirmed) return;

    localStorage.removeItem('token');
    await Swal.fire({ title: 'ออกจากระบบแล้ว', icon: 'success', timer: 900, showConfirmButton: false });
    router.replace('/member/signin');
  };

  // ===== minimal menus (ไม่ซ้ำ Navbar) =====
  const menus = [
    { href: '/backoffice/home/todo',      label: '✏️ บันทึกงาน',  icon: 'fa-list-check' },
    { href: '/backoffice/home/dashboard', label: '📁 รายงานสรุป', icon: 'fa-chart-pie' },
  ] as const;

  return (
    <aside className="fixed inset-y-0 left-0 h-screen w-[220px] bg-gray-900 text-gray-200 border-r border-gray-800 flex flex-col">


      <div className="px-4 py-5 space-y-5">
        {/* Brand (เล็ก เรียบ) */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sky-500/20 ring-1 ring-sky-400/30 grid place-items-center">
              👽
            {/* <i className="fa-solid fa-check text-sky-300" aria-hidden /> */}
          </div>
          <div className="font-semibold tracking-wide text-gray-100">Hello world 🛸</div>
        </div>

        {/* Profile compact */}
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              src="/images/profile.jpg" // ← เปลี่ยนเป็น path รูปของนิกกี้
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm text-gray-100">
              {loading ? 'Loading…' : name || '-'}
            </div>
            <div className="text-[11px] text-gray-400">ยินดีต้อนรับ 🌤️</div>
          </div>
          <button
            onClick={() => router.push('/backoffice/home/profile')}
            className="rounded-md px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10 hover:text-sky-200 transition"
          >
            Edit
          </button>
        </div>

        {/* เมนูหลัก (มินิมอล) */}
        <nav className="space-y-1">
          {menus.map((m) => {
            const active = isActive(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition
                  ring-1 ${active
                    ? 'bg-sky-500/15 text-sky-200 ring-sky-400/30'
                    : 'bg-gray-800/40 text-gray-300 ring-white/5 hover:bg-gray-800 hover:text-white hover:ring-white/10'
                  }`}
              >
                <i
                  className={`fa-solid ${m.icon} text-base
                    ${active ? 'text-sky-300' : 'text-gray-400 group-hover:text-white'}`}
                  aria-hidden
                />
                <span className="font-medium">{m.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ปุ่มล่าง — แยกจากเมนู เพื่อไม่ดูรก */}
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={signOut}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border
                       border-red-400/50 bg-transparent px-3 py-2 text-sm text-red-300
                       hover:bg-red-500/10 hover:border-red-300 transition"
          >
            <i className="fa-solid fa-right-from-bracket" aria-hidden />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
