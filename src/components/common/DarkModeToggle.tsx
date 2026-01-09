'use client';

import React, { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize from saved preference or OS preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedMode === 'true' || (savedMode === null && prefersDark);
    applyMode(shouldBeDark);
    setIsDark(shouldBeDark);

    // Keep in sync with OS changes
    const listener = (e: MediaQueryListEvent) => {
      if (savedMode === null) {
        applyMode(e.matches);
        setIsDark(e.matches);
      }
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
  }, []);

  const applyMode = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark-mode');
      root.dataset.theme = 'dark';
      document.body.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
      root.dataset.theme = 'light';
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    applyMode(newMode);
    localStorage.setItem('darkMode', newMode ? 'true' : 'false');
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      aria-label="Toggle Dark Mode"
      title={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
    >
      {isDark ? (
        <i className="fa-solid fa-sun"></i>
      ) : (
        <i className="fa-solid fa-moon"></i>
      )}
      
      <style jsx>{`
        .dark-mode-toggle {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff751f 0%, #ff9a56 100%);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 117, 31, 0.3);
          transition: all 0.3s ease;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dark-mode-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(255, 117, 31, 0.5);
        }

        .dark-mode-toggle:active {
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .dark-mode-toggle {
            bottom: 80px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
        }

        /* Dark Mode Styles */
        :global(.dark-mode) {
          background-color: #000000 !important;
          color: #e0e0e0 !important;
        }

        :global(.dark-mode) body {
          background-color: #000000 !important;
          color: #e0e0e0 !important;
        }

        :global(.dark-mode) .card,
        :global(.dark-mode) .product-area-wrapper,
        :global(.dark-mode) .single-shopping-card-one {
          background-color: #121212 !important;
          color: #e0e0e0 !important;
          border-color: #333333 !important;
        }

        :global(.dark-mode) h1,
        :global(.dark-mode) h2,
        :global(.dark-mode) h3,
        :global(.dark-mode) h4,
        :global(.dark-mode) h5,
        :global(.dark-mode) h6,
        :global(.dark-mode) .title {
          color: #ffffff !important;
        }

        :global(.dark-mode) p,
        :global(.dark-mode) span,
        :global(.dark-mode) .disc {
          color: #cccccc !important;
        }

        :global(.dark-mode) .header-one,
        :global(.dark-mode) .header-two,
        :global(.dark-mode) .header-three,
        :global(.dark-mode) .header-four,
        :global(.dark-mode) .header-five,
        :global(.dark-mode) header {
          background-color: #0a0a0a !important;
          border-bottom: 1px solid #333333 !important;
        }

        :global(.dark-mode) .footer-one,
        :global(.dark-mode) .footer-two,
        :global(.dark-mode) .footer-three,
        :global(.dark-mode) footer {
          background-color: #050505 !important;
          border-top: 1px solid #333333 !important;
        }

        :global(.dark-mode) .footer-one .title,
        :global(.dark-mode) .footer-two .title,
        :global(.dark-mode) .footer-three .title {
          color: #ffffff !important;
        }

        :global(.dark-mode) .footer-one a,
        :global(.dark-mode) .footer-two a,
        :global(.dark-mode) .footer-three a {
          color: #b0b0b0 !important;
        }

        :global(.dark-mode) .footer-one a:hover,
        :global(.dark-mode) .footer-two a:hover,
        :global(.dark-mode) .footer-three a:hover {
          color: #ff751f !important;
        }

        :global(.dark-mode) .bg_light-1,
        :global(.dark-mode) .bg-light {
          background-color: #000000 !important;
        }

        :global(.dark-mode) input,
        :global(.dark-mode) textarea,
        :global(.dark-mode) select {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
          border-color: #333333 !important;
        }

        :global(.dark-mode) input::placeholder,
        :global(.dark-mode) textarea::placeholder {
          color: #888888 !important;
        }

        :global(.dark-mode) .product-price,
        :global(.dark-mode) .price {
          color: #ff751f !important;
        }

        :global(.dark-mode) .btn-primary {
          background: linear-gradient(135deg, #ff751f 0%, #ff9a56 100%) !important;
          border-color: #ff751f !important;
        }

        :global(.dark-mode) .nav-link,
        :global(.dark-mode) .menu a {
          color: #d0d0d0 !important;
        }

        :global(.dark-mode) .nav-link:hover,
        :global(.dark-mode) .menu a:hover {
          color: #ff751f !important;
        }

        :global(.dark-mode) .border,
        :global(.dark-mode) hr {
          border-color: #333333 !important;
        }

        :global(.dark-mode) .text-muted {
          color: #999999 !important;
        }

        :global(.dark-mode) .badge {
          background-color: #333333 !important;
          color: #ffffff !important;
        }

        :global(.dark-mode) .alert {
          background-color: #121212 !important;
          border-color: #333333 !important;
          color: #e0e0e0 !important;
        }

        :global(.dark-mode) .modal-content {
          background-color: #121212 !important;
          color: #e0e0e0 !important;
        }

        :global(.dark-mode) .dropdown-menu {
          background-color: #121212 !important;
          border-color: #333333 !important;
        }

        :global(.dark-mode) .dropdown-item {
          color: #d0d0d0 !important;
        }

        :global(.dark-mode) .dropdown-item:hover {
          background-color: #2a2a2a !important;
          color: #ff751f !important;
        }
      `}</style>
    </button>
  );
}
