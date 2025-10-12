'use client';

import { Search } from 'lucide-react';
import { CategoryFilter } from '@/types/snippet';
import { useLanguage } from '@/context/LanguageContext';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: CategoryFilter;
  setSelectedCategory: (category: CategoryFilter) => void;
  categories: CategoryFilter[];
}

export default function SearchBar({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}: SearchBarProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={t.search.placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
        className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400 bg-white cursor-pointer transition"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat === 'all' ? t.search.allCategories : cat}
          </option>
        ))}
      </select>
    </div>
  );
}