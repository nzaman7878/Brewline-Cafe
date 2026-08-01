# ☕ Brewline Cafe

> A fast-casual specialty coffee & food ordering platform — browse menu, customize, pay online, get a pickup time.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

## 🏗️ Architecture

```
Brewline Cafe/
├── client/                    # React + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── api/               # API client (Axios)
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Route pages
│   │   └── styles/            # Tailwind config + custom styles
│   └── ...
│
├── server/                    # Node.js + Express (4-Tier Architecture)
│   ├── src/
│   │   ├── routes/            # Layer 1: Route definitions
│   │   ├── controllers/       # Layer 2: Request/Response handling
│   │   ├── services/          # Layer 3: Business logic
│   │   ├── repositories/      # Layer 4: Data access (Mongoose)
│   │   ├── models/            # Mongoose schemas
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── validators/        # Zod request schemas
│   │   ├── config/            # DB, env, external services
│   │   └── utils/             # Shared utilities
│   └── ...
│
├── .env.example               # Environment variable template
├── .gitignore
└── package.json               # Root workspace scripts
```

### Server 4-Tier Architecture

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Routes** | Define endpoints, attach middleware | `router.post('/orders', protect, orderController.create)` |
| **Controllers** | Parse requests, send responses | Validate input, call service, return JSON |
| **Services** | Business logic, orchestration | Calculate totals, apply promos, trigger notifications |
| **Repositories** | Data access, database queries | Mongoose CRUD operations, aggregation pipelines |

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Stripe account (test mode)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/nzaman7878/Brewline-Cafe.git
cd Brewline-Cafe

# 2. Install dependencies
npm run install:all

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Seed the database
npm run seed

# 5. Start development servers
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both client & server |
| `npm run dev:server` | Start server only |
| `npm run dev:client` | Start client only |
| `npm run seed` | Seed database with sample menu items |
| `npm test` | Run server tests |

## 🔑 Key Features

- 🍽️ **Menu Browsing** — Categories, search, item customization (size, milk, add-ons)
- 🛒 **Persistent Cart** — localStorage for guests, DB-synced for logged-in users
- 💳 **Online Payments** — Stripe Payment Elements (card, Apple Pay, Google Pay)
- 📦 **Real-Time Tracking** — Socket.io order status updates
- 👨‍🍳 **Staff Dashboard** — Kanban-style order queue with live updates
- ⚙️ **Admin Panel** — Menu management, analytics, promo codes, refunds
- 📧 **Notifications** — Email/SMS when order is ready
- 🔐 **Auth** — JWT + refresh tokens, role-based access (customer, staff, admin)

## 📝 License

ISC
