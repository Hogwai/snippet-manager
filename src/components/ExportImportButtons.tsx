'use client';

import { useRef, useState } from 'react';
import { Download, Upload, ChevronDown } from 'lucide-react';
import { Snippet } from '@/types/snippet';
import { useLanguage } from '@/context/LanguageContext';

interface ExportImportButtonsProps {
  snippets: Snippet[];
  onImport: (snippets: Snippet[]) => void;
}

export default function ExportImportButtons({ snippets, onImport }: ExportImportButtonsProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExportText = () => {
    if (snippets.length === 0) return;

    let textContent = '';
    snippets.forEach((snippet, index) => {
      textContent += `[${snippet.title}]\n`;
      textContent += `Category: ${snippet.category}\n`;
      textContent += `\n${snippet.content}\n`;
      
      if (index < snippets.length - 1) {
        textContent += '\n' + '='.repeat(80) + '\n\n';
      }
    });

    downloadFile(textContent, 'text/plain', '.txt');
    setShowExportMenu(false);
  };

  const handleExportJson = () => {
    if (snippets.length === 0) return;

    const dataStr = JSON.stringify(snippets, null, 2);
    downloadFile(dataStr, 'application/json', '.json');
    setShowExportMenu(false);
  };

  const downloadFile = (content: string, mimeType: string, extension: string) => {
    const dataBlob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snippets-export-${new Date().toISOString().split('T')[0]}${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedSnippets = JSON.parse(content) as Snippet[];
        
        if (!Array.isArray(importedSnippets)) {
          alert(t.importError);
          return;
        }

        onImport(importedSnippets);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import error:', error);
        alert(t.importError);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          disabled={snippets.length === 0}
          className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={t.export}
        >
          <Download size={18} />
          <span className="hidden sm:inline whitespace-nowrap">{t.export}</span>
          <ChevronDown size={16} className="ml-auto" />
        </button>

        {showExportMenu && snippets.length > 0 && (
          <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[180px]">
            <button
              onClick={handleExportText}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition flex items-center gap-2"
            >
              <Download size={16} />
              {t.exportText}
            </button>
            <button
              onClick={handleExportJson}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition flex items-center gap-2 border-t"
            >
              <Download size={16} />
              {t.exportJson}
            </button>
          </div>
        )}
      </div>
      
      <button
        onClick={handleImportClick}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center gap-2 transition min-w-fit"
        title={t.import}
      >
        <Upload size={18} />
        <span className="hidden sm:inline whitespace-nowrap">{t.import}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}