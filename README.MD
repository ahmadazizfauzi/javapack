# JavaPack

An international travel gear rental platform featuring a **Public Website**, **Admin CMS**, **Midtrans Sandbox** payment integration, and **n8n** workflow automation.

## Repository Structure

This repository consists of two main applications:

- **[`frontend/`](./frontend/README.md)** — Web application built with **Next.js & Tailwind CSS** covering the Public Website (Home, About Us, Product Catalog, FAQ, Contact, Auth, Profile & Rental History) and the Admin CMS Panel. See [Frontend Documentation](./frontend/README.md) for detailed setup, module structure, and design tokens.
- **[`backend/`](./backend/README.md)** — REST API built with **Express.js & MySQL (Sequelize ORM)** handling JWT authentication, CMS content management, products & categories, pickup locations, rental orders, and Midtrans & n8n webhooks. See [Backend Documentation](./backend/README.md) for detailed API endpoints, database migrations, and seeders.

## n8n Automation & WhatsApp Notification

When a rental order payment is confirmed (`pending_payment` -> `paid` via Midtrans webhook or status sync), `OrderService` generates a unique `pickup_token` and a QR code PNG (`qrcode`), then `N8nService` automatically sends a `POST` `order.paid` payload (`order_code`, `customer_name`, `customer_email`, `customer_phone`, `product_name`, `is_physical`, `pickup_location_name`, `pickup_token`, `qr_image_url`, `qr_image_base64`, `quantity`, `start_date`, `end_date`, `duration_days`, `total_amount`, `status`) to `N8N_WEBHOOK_URL`.

- **Live Demo Webhook:** `backend/.env.example` is pre-configured with `N8N_WEBHOOK_URL=http://195.88.211.211:5678/webhook/javapack-order`, connected to a hosted **n8n + WAHA (WhatsApp HTTP API)** workflow on VPS. Registering with an active WhatsApp number allows immediate end-to-end notification testing from local without running n8n manually.
- **Base64 QR Delivery for Localhost Compatibility:** Because the backend runs locally (`localhost:5000`) while n8n + WAHA run on the remote VPS, the backend embeds the generated QR PNG as `qr_image_base64` inside the webhook payload. The `"WAHA: Kirim QR Code WA"` node (`/api/sendImage`) sends `file.data` directly from `qr_image_base64`, so WAHA never needs to fetch `http://localhost:5000/...` from the reviewer's machine.
- **Workflow Export:** [`backend/n8n-javapack-workflow.json`](./backend/n8n-javapack-workflow.json) — ready-to-import n8n workflow (`Webhook: Order Paid` -> `Format Payload & Nomor WA` -> `Cek Nomor WA Valid` -> `WAHA: Kirim Konfirmasi WA` -> `WAHA: Kirim QR Code WA`).

## QR Pickup Verification & Mobile Scan (`adb reverse`)

- **Physical Products (`is_physical: true`):** Require an airport pickup location at checkout. The WhatsApp QR encodes `${CLIENT_URL}/pickup-verify?token=${pickup_token}`. Opening the link presents a counter-staff verification page protected by admin authentication (seeded staff account: `petugas@gmail.com` / `password`), where staff can flip a toggle to update the order status to `active_rent`.
- **Digital Products (`is_physical: false`, e.g. `eSIM Japan`):** Do not require an airport pickup location at checkout and skip physical stock return on completion. The WhatsApp QR encodes `ESIM:<order_code>:<pickup_token>`.
- **Scanning `localhost` QR from an Android Phone (`adb reverse`):**
  When running both apps locally (`CLIENT_URL=http://localhost:3000` and `NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`), connect an Android device with USB Debugging enabled and run:

  ```bash
  adb reverse tcp:3000 tcp:3000
  adb reverse tcp:5000 tcp:5000
  ```

  This forwards `localhost:3000` and `localhost:5000` on the phone to your laptop so scanning the QR opens `/pickup-verify` and authenticates against your local API without changing `.env`. *(For wireless testing or iOS, set `CLIENT_URL` and `NEXT_PUBLIC_API_URL` to your laptop's LAN IP instead.)*

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
