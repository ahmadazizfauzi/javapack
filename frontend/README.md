# JavaPack - Travel Gear Rental & CMS Frontend Web Application

A modern, responsive web application for international travel gear rental, public content showcase, and admin CMS management. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and a custom **Dark Theme Reusable UI Kit (`base_*`)** synced with the JavaPack FigCraft design system.

---

## Tech Stack
- **Framework**: Next.js 14 (React 18, App Router)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS + Custom Design Tokens (`base_colors`, `base_typography`)
- **Icons**: Lucide React
- **HTTP Client**: Axios (`axiosInstance.ts` with Bearer Token Interceptor)
- **Component Architecture**: Reusable UI Kit (`base_button`, `base_card`, `base_badge`, `base_input`, `base_textarea`, `base_dropdown`, `base_date_picker`, `base_modal`, `base_toast`, `base_table`, `base_pagination`, `base_accordion`, `base_filter_pills`, `base_search_bar`, `base_switch`, `base_image_upload`, `base_typography`, `base_navbar`, `base_sidebar`, `base_header`, `base_mobile_drawer`, `base_ambient_bg`)

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

### 1. Public Website (`/home`, `/about`, `/products`, `/faq`, `/contact`, `/profile`)
- **Landing Home (`/home`)**: CMS-managed hero header texts and interactive 3-card hero banner slider with auto-slide, navigation dots, and product target links.
- **About Us (`/about`)**: Full-bleed CMS-managed header banner behind the floating navbar, side image, eyebrow, headline, and story paragraphs.
- **Product Catalog & Gear Rental (`/products`)**: 1-second debounced API search bar, category filter pills, 20-item server-side pagination, responsive 1-4 column product cards with stock badges, and an interactive **Gear Rental Form** modal (`OrderModal`) connected to Midtrans Sandbox Snap.
- **FAQ (`/faq`)**: Smooth animated accordion (`base_accordion`) populated dynamically from CMS.
- **Contact (`/contact`)**: Embedded Google Maps view driven by CMS `latitude` & `longitude` coordinates alongside dynamic counter info and a contact inquiry form.
- **Profile & Rental History (`/profile`)**: Account details, Sign Out confirmation modal, and rental history logs with **Pay Now** action for `pending_payment` orders.

### 2. Admin CMS (`/admin/dashboard`, `/admin/*`)
- **KPI Overview (`/admin/dashboard`)**: Active products, active rentals, confirmed revenue, and total site visits.
- **Site Visits Analytics**: Daily bar chart (`01`–`31`) with page filter, visitor filter, and month/year dropdown selectors.
- **Master & Content Management**: CRUD for Categories, Products (with gallery image upload & category filter), Pickup Locations, and Website Content (`Home`, `About Us`, `FAQ`, `Contact`).
- **Operational Management**: Order status management (`Pending Payment`, `Paid (Booked)`, `Paid (Rented)`), User Management, and Contact Messages inbox.
- **CMS Navigation Shell**: Independent scrollable sidebar (`base_sidebar`) with collapsible `Website Content` submenu and responsive mobile hamburger drawer (`base_mobile_drawer`).

### 3. Authentication (`/login`, `/register`)
- Centered dark-theme login and registration cards with `BaseAmbientBg`, `BaseInput`, `baseTypography`, and JWT session handling.

### 4. Custom UI Kit & Design Tokens (`src/components/`, `src/tokens/`)
- Modular `base_*` presentational components separated from feature modules (`src/modules/`).
- Centralized color palette (`src/tokens/base_colors.ts`) and mandatory typography scale (`src/tokens/base_typography.ts`).

---

## Demo Accounts for Testing

Seeded accounts available when running the backend user seeder (`npx sequelize-cli db:seed --seed 20260101000000-demo-user.js`):

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `password` | Admin CMS & Public Website |
| **Customer** | `ahmad@gmail.com` | `password` | Public Website, Checkout & Profile |

---

## Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server on `http://localhost:3000` |
| `npm run build` | Compiles and optimizes production build |
| `npm run start` | Runs the built production server |
| `npm run lint` | Runs ESLint code quality checks |
