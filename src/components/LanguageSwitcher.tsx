'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-3 py-2">
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded transition ${
          language === 'fr'
            ? 'bg-gray-800 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded transition ${
          language === 'en'
            ? 'bg-gray-800 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
    </div>
  );
}