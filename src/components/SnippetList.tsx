'use client';

import SnippetItem from './SnippetItem';
import { Snippet, SnippetFormData } from '@/types/snippet';
import { useLanguage } from '@/context/LanguageContext';

interface SnippetListProps {
  snippets: Snippet[];
  onDeleteSnippet: (id: number) => void;
  onUpdateSnippet: (id: number, data: SnippetFormData) => void;
}

export default function SnippetList({ snippets, onDeleteSnippet, onUpdateSnippet }: SnippetListProps) {
  const { t } = useLanguage();
  
  if (snippets.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">{t.empty.title}</p>
        <p className="text-gray-300 text-sm mt-2">{t.empty.subtitle}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {snippets.map(snippet => (
        <SnippetItem
          key={snippet.id}
          snippet={snippet}
          onDelete={onDeleteSnippet}
          onUpdate={onUpdateSnippet}
        />
      ))}
    </div>
  );
}