'use client';

import { useState } from 'react';
import { Copy, Trash2, Check, Tag, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/snippetUtils';
import { Snippet } from '@/types/snippet';
import { useLanguage } from '@/context/LanguageContext';

interface SnippetItemProps {
  snippet: Snippet;
  onDelete: (id: number) => void;
}

export default function SnippetItem({ snippet, onDelete }: SnippetItemProps) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shouldTruncate = snippet.content.split('\n').length > 10 || snippet.content.length > 500;

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 text-lg mb-2">{snippet.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Tag size={14} />
              <span>{snippet.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(snippet.createdAt, language, t)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded transition"
            title={t.snippet.copy}
          >
            {copied ? (
              <Check size={18} className="text-green-600" />
            ) : (
              <Copy size={18} className="text-gray-600" />
            )}
          </button>
          <button
            onClick={() => onDelete(snippet.id)}
            className="p-2 hover:bg-red-50 rounded transition group"
            title={t.snippet.delete}
          >
            <Trash2 size={18} className="text-gray-600 group-hover:text-red-600 transition" />
          </button>
        </div>
      </div>
      <pre className={`bg-gray-50 p-4 rounded text-sm overflow-x-auto border border-gray-100 ${!isExpanded && shouldTruncate ? 'max-h-60 overflow-y-hidden' : ''} relative`}>
        <code className="text-gray-700">{snippet.content}</code>
        {!isExpanded && shouldTruncate && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
        )}
      </pre>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600 hover:text-gray-800 mt-2 font-medium transition"
        >
          {isExpanded ? t.snippet.showLess : t.snippet.showMore}
        </button>
      )}
    </div>
  );
}