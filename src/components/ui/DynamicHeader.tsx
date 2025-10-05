"use client";

import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header"), {
  ssr: false,
  loading: () => (
    <header style={{ padding: 12 }}>
      <div>
        <span>טוען...</span>
      </div>
    </header>
  ),
});

export default Header;
