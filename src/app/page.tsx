'use client';

import { useState } from 'react';
import SnippetForm from '@/components/SnippetForm';
import SnippetList from '@/components/SnippetList';
import SearchBar from '@/components/SearchBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useFileStorage } from '@/hooks/useFileStorage';
import { useLanguage } from '@/context/LanguageContext';
import { Snippet, SnippetFormData, CategoryFilter } from '@/types/snippet';

export default function Home() {
  const { t } = useLanguage();
  const [snippets, setSnippets] = useFileStorage<Snippet[]>('snippets', []);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const addSnippet = (snippet: SnippetFormData) => {
    const now = new Date().toISOString();
    const newSnippet: Snippet = {
      id: Date.now(),
      ...snippet,
      category: snippet.category || t.snippet.uncategorized,
      createdAt: now,
      updatedAt: now
    };
    setSnippets([newSnippet, ...snippets]);
  };

  const updateSnippet = (id: number, updatedData: SnippetFormData) => {
    setSnippets(snippets.map(s => 
      s.id === id 
        ? { ...s, ...updatedData, updatedAt: new Date().toISOString() }
        : s
    ));
  };

  const deleteSnippet = (id: number) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  const categories: CategoryFilter[] = ['all', ...new Set(snippets.map(s => s.category))];
  const existingCategories = Array.from(new Set(snippets.map(s => s.category)));

  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-light text-gray-800">{t.title}</h1>
            <p className="text-gray-500 mt-2">{t.subtitle}</p>
          </div>
          <LanguageSwitcher />
        </header>

        <SnippetForm onAddSnippet={addSnippet} existingCategories={existingCategories} />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        <SnippetList
          snippets={filteredSnippets}
          onDeleteSnippet={deleteSnippet}
          onUpdateSnippet={updateSnippet}
        />
      </div>
    </main>
  );
}