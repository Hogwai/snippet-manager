export interface Snippet {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface SnippetFormData {
  title: string;
  content: string;
  category: string;
}

export type CategoryFilter = 'all' | string;