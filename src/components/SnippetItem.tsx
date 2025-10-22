'use client';

import { useState, KeyboardEvent } from 'react';
import { Copy, Trash2, Check, Tag, Calendar, Edit2, X, Save } from 'lucide-react';
import { formatDate } from '@/lib/snippetUtils';
import { Snippet, SnippetFormData } from '@/types/snippet';
import { useLanguage } from '@/context/LanguageContext';

interface SnippetItemProps {
  snippet: Snippet;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: SnippetFormData) => void;
}

export default function SnippetItem({ snippet, onDelete, onUpdate }: SnippetItemProps) {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const [editTitle, setEditTitle] = useState<string>(snippet.title);
  const [editContent, setEditContent] = useState<string>(snippet.content);
  const [editCategory, setEditCategory] = useState<string>(snippet.category);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setEditTitle(snippet.title);
    setEditContent(snippet.content);
    setEditCategory(snippet.category);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    
    onUpdate(snippet.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      category: editCategory.trim() || t.snippet.uncategorized
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(snippet.title);
    setEditContent(snippet.content);
    setEditCategory(snippet.category);
    setIsEditing(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const shouldTruncate = snippet.content.split('\n').length > 10 || snippet.content.length > 500;

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-blue-200">
        <div className="mb-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded font-medium text-lg focus:outline-none focus:border-blue-400"
            placeholder={t.form.titlePlaceholder}
          />
        </div>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full px-3 py-2 border border-gray-300 rounded mb-3 h-40 focus:outline-none focus:border-blue-400 font-mono text-sm resize-y"
          placeholder={t.form.contentPlaceholder}
        />
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            placeholder={t.form.categoryPlaceholder}
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 transition"
          >
            <Save size={18} />
            {t.snippet.save}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 transition"
          >
            <X size={18} />
            {t.snippet.cancel}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {t.snippet.editShortcut}
        </p>
      </div>
    );
  }

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
              <span title={`${t.snippet.created}: ${formatDate(snippet.createdAt, language, t)}`}>
                {formatDate(snippet.updatedAt, language, t)}
                {snippet.createdAt !== snippet.updatedAt && (
                  <span className="ml-1 text-xs text-gray-400">({t.snippet.edited})</span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="p-2 hover:bg-blue-50 rounded transition group"
            title={t.snippet.edit}
          >
            <Edit2 size={18} className="text-gray-600 group-hover:text-blue-600 transition" />
          </button>
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