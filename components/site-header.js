"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "首页" },
  { href: "/traceability", label: "农场" },
  { href: "/trust", label: "信任中心" },
  { href: "/membership", label: "会员" },
  { href: "/products", label: "商品" },
  { href: "/about", label: "关于我们" },
  { href: "/join", label: "加入会员" },
  { href: "/admin", label: "后台" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-oat/90 backdrop-blur">
      <div className="container-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-lg font-semibold text-white">
              安
            </div>
            <div>
              <p className="font-serif text-xl text-ink">安心田</p>
              <p className="text-xs tracking-[0.24em] text-ink/55 uppercase">organic trust club</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white text-ink lg:hidden"
            aria-label="切换导航菜单"
            aria-expanded={menuOpen}
          >
            <span className="text-xl">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>

        <nav className={`${menuOpen ? "mt-4 flex" : "hidden"} flex-col gap-2 text-sm lg:mt-0 lg:flex lg:flex-row lg:flex-wrap lg:items-center`}>
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-full px-4 py-2 transition ${
                  active ? "bg-ink text-white" : "text-ink/72 hover:bg-white hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
