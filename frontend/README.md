# JavaPack - Travel Gear Rental & CMS Frontend Web Application

A modern, responsive web application for international travel gear rental, public content showcase, and admin CMS management. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and a custom **Dark Theme Reusable UI Kit (`base_*`)** synced with the JavaPack FigCraft design system.

---

## Tech Stack
- **Framework**: Next.js 14 (React 18, App Router)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS + Custom Design Tokens (`base_colors`, `base_typography`)
- **Icons**: Lucide React
- **HTTP Client**: Axios (`axiosInstance.ts` with Bearer Token Interceptor)
- **Component Architecture**: Reusable UI Kit (`base_button`, `base_card`, `base_badge`, `base_input`, `base_textarea`, `base_dropdown`, `base_date_picker`, `base_modal`, `base_toast`, `base_table`, `base_pagination`, `base_accordion`, `base_filter_pills`, `base_search_bar`, `base_navbar`, `base_sidebar`, `base_header`, `base_mobile_drawer`, `base_ambient_bg`)

---

## Getting Started

### 1. Navigate to Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (.env.local)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your active Express.js backend API server:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 4. Run Development Server
```bash
npm run dev
```

The frontend application will be accessible at: `http://localhost:3000`

---

## Key Features & Modules

### 1. Public Website (`/home`, `/about`, `/products`, `/faq`, `/contact`)
- **Landing Home (`/home`)**: Interactive 3-card hero banner slider with featured center card, navigation dots, and responsive mobile view.
- **About Us (`/about`)**: Full-bleed header banner behind the floating navbar, brand story, and service highlights (*100% Sterile, Terminal 3, 24/7 Support*).
- **Product Catalog & Gear Rental (`/products`)**: Live search bar, category filter pills, responsive 1-4 column product cards with stock badges, and an interactive **Gear Rental Form** modal (`OrderModal`) featuring date pickers, quantity input, pickup location selector, and automatic billing summary.
- **FAQ (`/faq`)**: Smooth animated accordion (`base_accordion`) for common rental and pickup questions.
- **Contact (`/contact`)**: Embedded Google Maps view pointing to Malang, East Java alongside a contact inquiry form.

### 2. Admin CMS Dashboard (`/dashboard`)
- **KPI Overview**: Active products, available units, paid orders, and highlighted total rental revenue card.
- **Site Visits Analytics**: Daily bar chart (`01`–`31`) with page filter, visitor filter, and calendar date picker dialog (`base_date_picker`).
- **CMS Navigation Shell**: Independent scrollable sidebar (`base_sidebar`) with collapsible `Website Content` submenu and responsive mobile hamburger drawer (`base_mobile_drawer`).

### 3. Authentication (`/login`)
- Centered dark-theme login card with `BaseAmbientBg`, `BaseInput` (email and password visibility toggle), and preview submission feedback.

### 4. Custom UI Kit & Design Tokens (`src/components/`, `src/tokens/`)
- Modular `base_*` presentational components separated from feature modules (`src/modules/`).
- Centralized color palette (`src/tokens/base_colors.ts`) and typography scale (`src/tokens/base_typography.ts`).

---

## Demo Accounts for Testing

*(Note: Frontend currently runs in UI Preview Mode with static mock data; backend Express API integration will connect to these seeded credentials.)*

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `password` | Admin CMS Dashboard & content management |

---

## Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server on `http://localhost:3000` |
| `npm run build` | Compiles and optimizes production build |
| `npm run start` | Runs the built production server |
| `npm run lint` | Runs ESLint code quality checks |
