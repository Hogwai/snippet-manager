# Snippet Manager

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat\&logo=typescript\&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat\&logo=next.js\&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat\&logo=react\&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat\&logo=tailwind-css\&logoColor=white)
![Tauri](https://img.shields.io/badge/Tauri-24C8D8?logo=tauri&logoColor=fff)

A minimalist code snippet manager, designed to quickly save and organize your code snippets, commands, or technical notes.

Available as a [web app](https://hogwai.github.io/snippet-manager/) and as a [windows desktop application](https://github.com/Hogwai/snippet-manager/releases/)

## Features

* **Quick snippet creation** with title, content, and category
* **Real-time search** across all snippets
* **Category system** with autocomplete
* **Responsive and minimalist interface**
* **Multilingual support** (French/English)
* **Automatic expand/collapse** for long snippets
* **One-click copy** to clipboard
* **Keyboard shortcut**: `Ctrl + Enter` for quick add

## Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **UI Library**: [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Storage**: Web app: browser local / Windows app: %APPDATA%\com.hogwai\snippet-manager\snippets.json
* **Windows app**: Tauri  

## Installation

### Prerequisites

* [Node.js](https://nodejs.org/) 20 and higher
* npm or yarn

### Steps

#### Clone the repository

```bash
git clone https://github.com/Hogwai/snippet-manager
```

#### Start the development server

```bash
npm run dev
```

#### Open in your browser

Go to [http://localhost:3000](http://localhost:3000)

## Web app: Important 

> **This project uses the browser’s LocalStorage to save your snippets.**

### What this means

* **No server required** – Everything runs locally
* **Private data** – Your snippets stay on your machine
* **Fast and instant** – No network latency
* **Not a credential manager** - Your snippets are stored as a plain json on your browser

### Limitations

* **No sync** – Snippets are only available on the current browser/device
* **Risk of data loss** – Clearing browser data or reinstalling the OS will erase them
* **Storage limit** – LocalStorage is limited to about 5–10 MB per domain
* **No automatic backup** – Export your snippets regularly

## Supported Languages

* French
* English

Language can be switched via the toggle at the top right. Your preference is saved automatically.

## Available Scripts

```bash
npm run dev      # Start in development mode
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint checks
npm run tauri:dev # Start tauri in dev mode
npm run tauri:build # Build the binaries
```
