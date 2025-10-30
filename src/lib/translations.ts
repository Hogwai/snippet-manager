export type Language = 'fr' | 'en';

export interface Translations {
  title: string;
  subtitle: string;
  export: string;
  exportJson: string;
  exportText: string;
  import: string;
  exportSuccess: string;
  importSuccess: string;
  importError: string;
  form: {
    titlePlaceholder: string;
    contentPlaceholder: string;
    categoryPlaceholder: string;
    addButton: string;
    shortcut: string;
  };
  search: {
    placeholder: string;
    allCategories: string;
  };
  snippet: {
    copy: string;
    delete: string;
    edit: string;
    save: string;
    cancel: string;
    showMore: string;
    showLess: string;
    today: string;
    yesterday: string;
    daysAgo: string;
    weeksAgo: string;
    monthsAgo: string;
    yearsAgo: string;
    week: string;
    weeks: string;
    month: string;
    months: string;
    year: string;
    years: string;
    uncategorized: string;
    created: string;
    edited: string;
    editShortcut: string;
  };
  empty: {
    title: string;
    subtitle: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    title: 'Snippet Manager',
    subtitle: 'Gérez vos snippets de code facilement',
    export: 'Exporter',
    exportJson: 'Exporter en JSON',
    exportText: 'Exporter en texte',
    import: 'Importer',
    exportSuccess: 'Snippets exportés avec succès',
    importSuccess: '{count} snippet(s) importé(s) avec succès',
    importError: 'Erreur lors de l\'importation du fichier',
    form: {
      titlePlaceholder: 'Titre du snippet',
      contentPlaceholder: 'Collez votre code ou texte ici...',
      categoryPlaceholder: 'Catégorie (optionnel)',
      addButton: 'Ajouter',
      shortcut: 'Astuce : Ctrl + Entrée pour ajouter rapidement',
    },
    search: {
      placeholder: 'Rechercher dans les snippets...',
      allCategories: 'Toutes catégories',
    },
    snippet: {
      copy: 'Copier',
      delete: 'Supprimer',
      edit: 'Modifier',
      save: 'Enregistrer',
      cancel: 'Annuler',
      showMore: '▼ Voir plus',
      showLess: '▲ Voir moins',
      today: "Aujourd'hui",
      yesterday: 'Hier',
      daysAgo: 'Il y a {count} jours',
      weeksAgo: 'Il y a {count} semaine{s}',
      monthsAgo: 'Il y a {count} mois',
      yearsAgo: 'Il y a {count} an{s}',
      week: 'semaine',
      weeks: 'semaines',
      month: 'mois',
      months: 'mois',
      year: 'an',
      years: 'ans',
      uncategorized: 'Sans catégorie',
      created: 'Créé',
      edited: 'modifié',
      editShortcut: 'Ctrl + Entrée pour enregistrer, Échap pour annuler',
    },
    empty: {
      title: 'Aucun snippet trouvé',
      subtitle: 'Ajoutez votre premier snippet ci-dessus',
    },
  },
  en: {
    title: 'Snippet Manager',
    subtitle: 'Manage your code snippets easily',
    export: 'Export',
    exportJson: 'Export JSON',
    exportText: 'Export Text',
    import: 'Import',
    exportSuccess: 'Snippets exported successfully',
    importSuccess: '{count} snippet(s) imported successfully',
    importError: 'Error importing file',
    form: {
      titlePlaceholder: 'Snippet title',
      contentPlaceholder: 'Paste your code or text here...',
      categoryPlaceholder: 'Category (optional)',
      addButton: 'Add',
      shortcut: 'Tip: Ctrl + Enter to add quickly',
    },
    search: {
      placeholder: 'Search in snippets...',
      allCategories: 'All categories',
    },
    snippet: {
      copy: 'Copy',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      showMore: '▼ Show more',
      showLess: '▲ Show less',
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: '{count} days ago',
      weeksAgo: '{count} week{s} ago',
      monthsAgo: '{count} month{s} ago',
      yearsAgo: '{count} year{s} ago',
      week: 'week',
      weeks: 'weeks',
      month: 'month',
      months: 'months',
      year: 'year',
      years: 'years',
      uncategorized: 'Uncategorized',
      created: 'Created',
      edited: 'edited',
      editShortcut: 'Ctrl + Enter to save, Esc to cancel',
    },
    empty: {
      title: 'No snippets found',
      subtitle: 'Add your first snippet above',
    },
  },
};