# JavaPack

An international travel gear rental platform featuring a **Public Website**, **Admin CMS**, **Midtrans Sandbox** payment integration, and **n8n** workflow automation.

## Repository Structure

This repository consists of two main applications:

- **[`frontend/`](./frontend/README.md)** — Web application built with **Next.js & Tailwind CSS** covering the Public Website (Home, About Us, Product Catalog, FAQ, Contact, Auth, Profile & Rental History) and the Admin CMS Panel. See [Frontend Documentation](./frontend/README.md) for detailed setup, module structure, and design tokens.
- **[`backend/`](./backend/README.md)** — REST API built with **Express.js & MySQL (Sequelize ORM)** handling JWT authentication, CMS content management, products & categories, pickup locations, rental orders, and Midtrans & n8n webhooks. See [Backend Documentation](./backend/README.md) for detailed API endpoints, database migrations, and seeders.

## n8n Automation & WhatsApp Notification

When a rental order payment is confirmed (`pending_payment` -> `paid` via Midtrans webhook or status sync), `N8nService` automatically sends a `POST` `order.paid` payload (`order_code`, `customer_name`, `customer_email`, `customer_phone`, `product_name`, `pickup_location_name`, `quantity`, `start_date`, `end_date`, `duration_days`, `total_amount`, `status`) to `N8N_WEBHOOK_URL`.

- **Live Demo Webhook:** `backend/.env.example` is pre-configured with `N8N_WEBHOOK_URL=http://195.88.211.211:5678/webhook/javapack-order`, connected to a hosted **n8n + WAHA (WhatsApp HTTP API)** workflow on VPS. Registering with an active WhatsApp number allows immediate end-to-end notification testing from local without running n8n manually.
- **Workflow Export:** [`backend/n8n-javapack-workflow.json`](./backend/n8n-javapack-workflow.json) — ready-to-import n8n workflow (`Webhook: Order Paid` -> `Format Payload & Nomor WA` -> `Cek Nomor WA Valid` -> `WAHA: Kirim Konfirmasi WA`).

### Sample WhatsApp Output

```text
Halo *Ahmad Aziz Fauzi*!

Pembayaran sewa perlengkapan *JavaPack* kamu sudah berhasil dikonfirmasi.

*Kode Order:* JVP-20261118-1004
*Produk:* modem (1 unit)
*Lokasi Pickup:* suhat
*Tanggal Sewa:* 2026-11-19 s/d 2026-11-26 (7 hari)
*Total Bayar:* Rp 700.000
*Status:* PAID

Silakan tunjukkan kode order ini saat pengambilan gear di lokasi pickup. Terima kasih telah memilih JavaPack!
```
