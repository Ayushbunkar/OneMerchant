# OneMerchant — AI Commerce Operating System

> **One Dashboard. Zero Commission. AI Powered Commerce Operating System.**

A production-grade SaaS platform that replaces Shopify, Tally, CRM tools, and analytics dashboards with one intelligent, AI-powered dashboard for merchants.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, Shadcn UI |
| **Backend** | Node.js, Express.js, TypeScript, Prisma |
| **AI** | Python, FastAPI, scikit-learn, OpenAI |
| **Database** | PostgreSQL 16 |
| **Cache/Queue** | Redis 7, BullMQ |
| **Storage** | Cloudinary |
| **Deployment** | Docker, AWS, Vercel |

## Project Structure

```
onemerchant/
├── apps/
│   ├── web/          # Next.js Frontend (port 3000)
│   ├── api/          # Express.js Backend (port 4000)
│   └── ai/           # Python FastAPI AI Service (port 8000)
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   └── validators/    # Shared Zod validators
├── docker/
│   ├── docker-compose.yml
│   ├── api.Dockerfile
│   └── ai.Dockerfile
├── turbo.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Python 3.12+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

### 1. Clone and Install

```bash
git clone <repo-url>
cd onemerchant

# Install Node.js dependencies
pnpm install

# Install Python dependencies
cd apps/ai
python -m venv .venv
.venv/Scripts/activate  # Windows
pip install -r requirements.txt
cd ../..
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Start Infrastructure (Docker)

```bash
# Start PostgreSQL + Redis
pnpm docker:up
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### 5. Start Development Servers

```bash
# Terminal 1: Frontend (port 3000)
pnpm dev:web

# Terminal 2: Backend (port 4000)
pnpm dev:api

# Terminal 3: AI Service (port 8000)
pnpm dev:ai
```

Or run all at once:

```bash
pnpm dev
```

## Key Features

- 📦 **Inventory Management** — Products, categories, variants, stock tracking, low-stock alerts
- 🛒 **Order Management** — Full order lifecycle, invoices, returns
- 👥 **CRM** — Customer profiles, purchase history, segmentation
- 🏭 **Supplier Management** — Purchase orders, supplier scoring
- 💳 **Payments** — Multi-method payment tracking
- 📊 **Analytics** — Real-time dashboards, sales reports, charts
- 📢 **Marketing** — Campaigns, coupons, multi-channel messaging
- 🤖 **AI Assistant** — Chat-based business intelligence
- 📈 **AI Predictions** — Demand forecasting, churn prediction, reorder suggestions

## API Endpoints

| Service | Base Path | Port |
|---|---|---|
| Frontend | `http://localhost:3000` | 3000 |
| Backend API | `http://localhost:4000/api/v1` | 4000 |
| AI Service | `http://localhost:8000/api/v1/ai` | 8000 |
| Prisma Studio | `http://localhost:5555` | 5555 |

## License

Private — All rights reserved.
