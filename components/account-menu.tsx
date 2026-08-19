"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { memberSignOutAction } from "@/lib/auth/member-actions";
import { MemberAvatar } from "@/components/member-avatar";

export function AccountMenu({
  name,
  image,
  profileCompleted,
  mobile = false,
}: {
  name: string;
  image?: string | null;
  profileCompleted: boolean;
  mobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className={`relative ${mobile ? "border-b border-[var(--line)] pb-2" : ""}`} ref={containerRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={mobile ? "Open account menu" : `${name} account menu`}
        className={`flex cursor-pointer items-center gap-2 ${mobile ? "w-full px-1 py-3 text-left text-[0.8rem] font-black tracking-[0.08em] uppercase" : "rounded-full"}`}
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
      >
        {mobile ? <span>Account</span> : <MemberAvatar name={name} image={image} size="small" />}
        {mobile ? <span aria-hidden="true">⌄</span> : <span className="sr-only">Open account menu</span>}
      </button>
      {open ? (
        <div
          className={`z-10 grid min-w-[190px] gap-1 border border-[var(--line)] bg-brand-paper p-3 shadow-[0_18px_45px_rgba(35,31,32,0.15)] ${mobile ? "static mt-2 shadow-none" : "absolute right-0 top-[calc(100%+12px)]"}`}
          id={menuId}
          role="menu"
        >
          <Link className="px-2 py-2 text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" href={profileCompleted ? "/profile" : "/profile/setup"} onClick={closeMenu} role="menuitem">My profile</Link>
          {profileCompleted ? <Link className="px-2 py-2 text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" href="/profile/edit" onClick={closeMenu} role="menuitem">Edit profile</Link> : null}
          <form action={memberSignOutAction} onSubmit={closeMenu}>
            <button className="w-full px-2 py-2 text-left text-[0.72rem] font-black tracking-[0.08em] uppercase hover:text-brand-red" role="menuitem" type="submit">Sign out</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
