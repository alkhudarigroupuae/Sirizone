'use client';

import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="language-switcher">
      <button
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="lang-toggle-btn"
        title={language === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}
      >
        <i className="fa-solid fa-globe me-2"></i>
        {language === 'en' ? 'العربية' : 'English'}
      </button>

      <style jsx>{`
        .language-switcher {
          display: inline-block;
        }

        .lang-toggle-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #ff751f 0%, #ff9a56 100%);
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 117, 31, 0.2);
        }

        .lang-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 117, 31, 0.3);
        }

        .lang-toggle-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .lang-toggle-btn {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
