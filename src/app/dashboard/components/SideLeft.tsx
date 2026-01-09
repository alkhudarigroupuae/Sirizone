// components/SideLeft.tsx
"use client";
import Image from 'next/image';
import SideMenu from "./SideMenu";
import Link from 'next/link';

interface SideLeftProps {
  collapsed: boolean;
}

function SideLeft({ collapsed }: SideLeftProps) {
  return (
    <div className={`sidebar_left ${collapsed ? 'collapsed' : ''}`}>
      <Link href="/dashboard" className="logo">
        <img
          src="/assets/images/logo/logo-01.svg"
          alt="logo"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Link>
      <SideMenu />
    </div>
  );
}

export default SideLeft;