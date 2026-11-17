# JavaPack — Travel Gear Rental Platform & CMS

An international travel gear rental platform (Pocket WiFi, eSIM, SIM Card, and travel gear) featuring a **Public Website**, **Admin CMS**, **Midtrans Sandbox** payment integration, and **n8n** workflow automation.

## Repository Structure

This repository consists of two main applications:

- **[`frontend/`](./frontend/README.md)** — Web application built with **Next.js & Tailwind CSS** covering the Public Website (Home, About Us, Product Catalog, FAQ, Contact, Auth, Profile & Rental History) and the Admin CMS Panel. See [Frontend Documentation](./frontend/README.md) for detailed setup, module structure, and design tokens.
- **[`backend/`](./backend/README.md)** — REST API built with **Express.js & MySQL (Sequelize ORM)** handling JWT authentication, CMS content management, products & categories, pickup locations, rental orders, and Midtrans & n8n webhooks. See [Backend Documentation](./backend/README.md) for detailed API endpoints, database migrations, and seeders.

## Architecture & Key Features

- **Layered Backend (`backend/`):** `routes -> controllers -> services -> models` with MySQL + Sequelize migrations/seeders, JWT auth + role-based access (`admin` / `customer`), Midtrans Snap Sandbox integration, and n8n webhook trigger (`order.paid`).
- **Modular Frontend (`frontend/`):** Next.js App Router organized by domain (`auth`, `public`, `dashboard`, `cms`), reusable `base_*` UI kit (`src/components/ui/`), and centralized design tokens (`src/tokens/`).
- **Quick Start:**
  1. Configure `backend/.env` and run `npm install`, `npm run db:migrate`, `npm run db:seed`, and `npm run dev` inside `backend/`.
  2. Configure `frontend/.env.local` and run `npm install` and `npm run dev` inside `frontend/`.
