# Kali Linux Admin Panel

A premium, glassmorphic administrative dashboard built with React and Vite, designed to manage deep-tech configurations including Ads, AI models, Topics, and Quizzes.

## 🚀 Key Features

- **Modern Glassmorphic UI**: High-density interface with vibrant aesthetics and smooth transitions.
- **Unified Ads Management**: Cross-platform (Android/iOS) AdMob orchestration with `PATCH` API for individual field updates.
- **AI Core Orchestration**: Fine-tune Gemini/OpenAI thresholds and API keys.
- **Content Management**: Full CRUD for Topics, Sub-categories, and specialized learning modules.
- **Diagnostic Controls**: Real-time status indicators and orchestration persistence feedback.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [Axios](https://axios-http.com/), [React Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd React-admin_panel
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run in development mode**:
    ```bash
    npm run dev
    ```

## 🌐 API & Proxy

The application communicates with a DigitalOcean-hosted backend. Network requests are proxied via `vite.config.js`:


## 📂 Project Structure

- `src/models/`: Service layer for API interactions.
- `src/views/pages/`: Main application modules (Ads, AI, Quizzes).
- `src/views/layouts/`: Global layout components.
- `src/style.css`: Core design system and Tailwind directives.

---------------------------------------------------------------------------------------------------------------------------------
