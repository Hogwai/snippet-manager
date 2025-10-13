import { Snippet } from '@/types/snippet';
import { Language, Translations } from './translations';

export function formatDate(dateString: string, language: Language, t: Translations): string {
  const date = new Date(dateString);
  const now = new Date();
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = nowOnly.getTime() - dateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return t.snippet.today;
  } else if (diffDays === 1) {
    return t.snippet.yesterday;
  } else if (diffDays < 7) {
    return t.snippet.daysAgo.replace('{count}', diffDays.toString());
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    const plural = weeks > 1 ? (language === 'en' ? 's' : 's') : '';
    return t.snippet.weeksAgo
      .replace('{count}', weeks.toString())
      .replace('{s}', plural);
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    const plural = months > 1 && language === 'en' ? 's' : '';
    return t.snippet.monthsAgo
      .replace('{count}', months.toString())
      .replace('{s}', plural);
  } else {
    const years = Math.floor(diffDays / 365);
    const plural = years > 1 ? (language === 'en' ? 's' : 's') : '';
    return t.snippet.yearsAgo
      .replace('{count}', years.toString())
      .replace('{s}', plural);
  }
}

export function exportSnippets(snippets: Snippet[]): void {
  const dataStr = JSON.stringify(snippets, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `snippets-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importSnippets(file: File): Promise<Snippet[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const snippets = JSON.parse(result) as Snippet[];
          resolve(snippets);
        } else {
          reject(new Error('Format de fichier invalide'));
        }
      } catch (error) {
        reject(new Error('Fichier JSON invalide'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsText(file);
  });
}