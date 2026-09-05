# 🎓 Research Archive

A comprehensive, production-ready full-stack collaborative portal and directory for scholarly papers, scientific topics, and interactive researcher profiles. This platform features robust, self-healing document management, persistent bookmarking, and dynamic indexing.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite)](https://vite.dev)

---

## ✨ Features

- **📚 Unified Scholarly Catalog**: Seamless search, filtering, and categorization of publications, research papers, and technical manuscripts.
- **👤 Dynamic Researcher Profiles**: High-fidelity academic portfolios showing individual publications, linked subjects, and institutional citations.
- **🔖 Advanced Personal Bookmarking**: Fast client-side and server-persisted reference tracking for streamlined reference lists and research pipelines.
- **🛡️ Robust Document Delivery & Self-Healing**: Automated dynamic PDF generator which instantly resolves and recovers missing file links with valid, standardized PDF replicas.
- **💾 Fail-Safe File Backup & Restoration**: Dual-layer replication that automatically backs up uploaded research manuscripts as persistent base64 payloads to prevent container data-loss upon cold restarts.
- **⚡ Fluid Interactions**: Staggered content reveals and micro-animations built with `motion/react` and an elegant, modern dark dashboard layout.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** – Functional components, state hooks, and high-performance interactive views.
- **Vite 6** – Fast development server with optimized CJS/ESM bundling.
- **Tailwind CSS v4** – Modern declarative utility utility-first styles and seamless CSS variables.
- **Motion / Framer Motion** – Fluid screen transitions, gesture feedback, and smooth accordion controls.
- **Lucide React** – Clean and consistent vector-based iconography.

### Backend & Storage
- **Express.js (Node.js)** – Lightweight, high-performance API server and secure static file proxy.
- **MongoDB & JSON Database Store** – Highly organized local indexing database with automatic local replication.
- **TSX / Esbuild** – Type-stripping fast typescript dev execution and compressed production bundles.

---

## 📂 Project Structure

```text
├── src/                    # React Frontend Source
│   ├── components/         # Highly modularized React Components
│   │   ├── PapersView.tsx  # Central paper index, search, and detail modal
│   │   ├── ProfileView.tsx # Author dashboard, linked papers, & bio editing
│   │   └── ...             # Other modular view interfaces
│   ├── App.tsx             # Root Application state and navigation
│   ├── main.tsx            # Main client entrypoint
│   ├── index.css           # Global styles and Tailwind v4 imports
│   └── types.ts            # Core TypeScript model definitions
├── server.ts               # Custom Express Full-Stack Server
├── server-db.ts            # Database models, schemas, and indexing logic
├── public/                 # Static assets and sample manuscripts
├── uploads/                # Dynamic user uploaded paper directory (Git Ignored)
├── metadata.json           # AI Studio applet configurations
├── tsconfig.json           # TS rules and module resolution configurations
└── package.json            # Node.js dependencies, scripts, and build tasks
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher recommended)

### 2. Installation
Clone the repository and install all required dependencies:
```bash
git clone https://github.com/your-username/research-archive.git
cd research-archive
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and define any required configurations:
```env
PORT=3000
NODE_ENV=development
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Running the Development Server
Execute the following command to start both the Express backend and Vite development environment:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`** to see the running application.

---

## 📦 Production Build & Deployment

To prepare the application for production, generate a self-contained, high-performance bundle:

```bash
# Compile client assets and bundle Express backend into a CJS package
npm run build

# Start the optimized server in standalone production mode
npm run start
```

### Build Details
The production build pipeline automatically compiles client code into `dist/` and compiles `server.ts` to `dist/server.cjs` using `esbuild`. This encapsulates the entire system into a cold-start-friendly and robust single file that bypasses ESM relative import rules.

---

## 🛡️ Self-Healing & PDF Integrity

This codebase implements a specialized **Self-Healing Static Resource System**:
1. When a researcher or user clicks download on a paper, the server intercepts request routes.
2. If the requested PDF (whether a sample-paper or user-upload) is missing from disk, a generator automatically builds a 100% valid, structurally standard minimal PDF stream containing the paper's title on-the-fly.
3. This prevents standard `404 Not Found` errors and provides a consistent, reliable user-download experience.

---

## 🤝 Contributing

Contributions are highly welcome! To contribute:
1. Fork this repository.
2. Create a new feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes (`git commit -m 'Add some awesome feature'`).
4. Push to the branch (`git push origin feature/awesome-feature`).
5. Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
