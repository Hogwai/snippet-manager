'use client';

import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { SnippetFormData } from '@/types/snippet';
import { useLanguage } from '@/context/LanguageContext';

interface SnippetFormProps {
  onAddSnippet: (snippet: SnippetFormData) => void;
  existingCategories: string[];
}

export default function SnippetForm({ onAddSnippet, existingCategories }: SnippetFormProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    onAddSnippet({
      title: title.trim(),
      content: content.trim(),
      category: category.trim()
    });

    setTitle('');
    setContent('');
    setCategory('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const filteredCategories = existingCategories.filter(cat => 
    cat.toLowerCase().includes(category.toLowerCase()) && 
    cat !== t.snippet.uncategorized
  );

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setShowSuggestions(value.length > 0 && filteredCategories.length > 0);
  };

  const selectCategory = (cat: string) => {
    setCategory(cat);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <input
        type="text"
        placeholder={t.form.titlePlaceholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full px-4 py-2 border border-gray-200 rounded mb-3 focus:outline-none focus:border-gray-400 transition"
      />
      <textarea
        placeholder={t.form.contentPlaceholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyPress}
        className="w-full px-4 py-2 border border-gray-200 rounded mb-3 h-32 focus:outline-none focus:border-gray-400 font-mono text-sm transition resize-y"
      />
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t.form.categoryPlaceholder}
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setShowSuggestions(category.length > 0 && filteredCategories.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition"
          />
          {showSuggestions && filteredCategories.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
              {filteredCategories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => selectCategory(cat)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center gap-2 transition"
        >
          <Plus size={18} />
          {t.form.addButton}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">{t.form.shortcut}</p>
    </div>
  );
}