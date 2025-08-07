# Evento-Web Frontend Next.js Project

## Introduction

Welcome to the Evento Next.js project. This project aims to transition the existing Swift-based frontend to a Next.js-based Progressive Web Application (PWA). The backend remains in Express.js.

## Project Structure

- **frontend**: Contains the Next.js application.

## Prerequisites

- Node.js version 14.x or higher
- PNPM

## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/EventoOrganization/evento_web
   cd evento-web
   ```

2. **Install dependencies**:

   ```sh
   pnpm install
   ```

3. **Create a `.env` file**:

   ```sh
   cp .env.example .env
   ```

## Usage

1. **Start the development server**:

   ```sh
   npm run dev
   ```

2. **Open your browser and go to http://localhost:3000**:


## 🚀 EventoApp.io – Tech Stack Overview

### 🖥️ Frontend – `evento-web` (Next.js PWA)

**Core Stack**
- **Framework**: Next.js 14 (App Router, PWA support)
- **Language**: TypeScript
- **UI**: Tailwind CSS with `tailwind-merge`, `clsx`, and `cva`
- **Component System**: Radix UI, Lucide icons, custom `@ezstart/ez-tag`
- **Forms**: React Hook Form + Zod + resolvers
- **Maps & Geolocation**: `@react-google-maps/api`
- **Media**: `react-easy-crop`, HEIC conversion, slick-carousel
- **State Management**: Zustand (typed, slice-based architecture)
- **WebSocket**: `socket.io-client`
- **Accessibility & SEO**: semantic, variant-based components + `next-sitemap`

**Main Features**
- Fully responsive and mobile-first UI
- Local image cropping, preview, and upload (to S3)
- Stripe Checkout integration (ticketing, onboarding)
- Confetti effects, toasts, and animated UX
- Multilingual routes (`/fr`, `/en`)
- JWT-based authentication via global context

**Tooling**
- ESLint, Prettier, Husky, Commitizen (conventional commits)
- Testing: Jest
- Scripts managed with `pnpm`
- Build process with `next build` and `next-pwa`

---

### 🛠️ Backend – `evento-backend` (Node.js API)

**Core Stack**
- **Language**: TypeScript
- **Framework**: Express.js with EJS templating
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, `express-session`
- **WebSocket**: Socket.IO for chat and realtime updates
- **File Handling**: Multer, AWS S3, ffmpeg, express-fileupload
- **Email & Notifications**: Mailjet, Nodemailer, Web Push
- **Stripe Integration**: Webhooks for checkout & onboarding
- **Scheduled Tasks**: `node-schedule` (cron jobs)
- **Validation**: `node-input-validator`

**Dev Tooling**
- Hot reload with `nodemon`
- Type safety via `@types` and strict TS config
- Mongo migrations: `migrate-mongo`
- Scripted build & asset copying: `tsc`, `cpx`, `pnpm`

---

> ✅ Modular, full-typed architecture. Secure JWT-based communication between frontend and backend. Complete event management system including ticketing, file uploads, payments, and notifications.


