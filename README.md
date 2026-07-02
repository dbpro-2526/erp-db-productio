# ERP Inventory & Demand Management System

Complete enterprise resource planning system built with Next.js, Prisma, and PostgreSQL.

## Features

- **Authentication**: Secure login with JWT tokens
- **Demand Management**: Create, submit, and track demands
- **Approval Workflow**: Multi-level approval with email notifications
- **Stock Management**: Track inventory with ledger entries
- **Item Management**: Manage SKUs, pricing, and reorder levels
- **User Management**: Role-based access control with 10 predefined roles
- **Office Hierarchy**: Support for state > region > division structure
- **Admin Panel**: Full administrative control
- **Audit Logging**: Track all system actions
- **Reports Dashboard**: Analytics and statistics

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Installation

```bash
# Clone and setup
git clone https://github.com/dbpro-2526/erp-db-productio.git
cd erp-db-productio
git checkout feat/demands-scaffold

# Environment setup
cp .env.example .env
# Edit .env and set JWT_SECRET and POSTGRES_URL

# Start database
docker-compose up -d

# Install dependencies
npm install
npx prisma generate

# Database migration
npx prisma migrate dev --name init

# Seed sample data
npm run prisma:seed

# Start dev server
npm run dev
```

### Access Application

- **URL**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Demo Credentials**:
  - Email: `dbprodhind@gmail.com`
  - Password: `dbpr@2526`

## Project Structure

```
.
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── pages/
│   │   ├── api/               # API routes
│   │   ├── login.tsx          # Login page
│   │   ├── dashboard.tsx      # Dashboard
│   │   ├── demands.tsx        # Demands management
│   │   ├── approvals.tsx      # Approval workflow
│   │   ├── stock.tsx          # Stock management
│   │   ├── items.tsx          # Items management
│   │   ├── users.tsx          # Users list
│   │   └── admin.tsx          # Admin panel
│   ├── lib/
│   │   ├── auth.ts            # Authentication helpers
│   │   └── prisma.ts          # Prisma client
│   └── services/
│       └── email.ts           # Email service
├── docker-compose.yml         # Docker services
├── .env.example               # Environment template
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

## Database Schema

### Tables
- **users**: System users with roles
- **roles**: Predefined roles (Super Admin, Admin, Manager, etc.)
- **offices**: Organization hierarchy
- **items**: Inventory items with SKU and pricing
- **stock**: Current inventory levels
- **stockLedger**: Stock movement history
- **demands**: Demand requests
- **demandLines**: Individual items in demands
- **approvals**: Approval chain for demands
- **auditLog**: Action audit trail

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Demands
- `GET /api/demands` - List demands
- `POST /api/demands` - Create demand
- `GET /api/demands/[id]` - Demand details
- `PATCH /api/demands/[id]` - Update demand

### Approvals
- `GET /api/approvals/pending` - Pending approvals
- `POST /api/approvals/[id]` - Make approval decision

### Stock
- `GET /api/stock` - Current stock
- `GET /api/stock/ledger` - Stock history
- `POST /api/stock/ledger` - Stock in/out entry

### Items
- `GET /api/items` - List items
- `POST /api/items` - Create item

### Users & Admin
- `GET /api/users` - List users
- `GET /api/roles` - List roles
- `GET /api/offices` - List offices
- `GET /api/reports/dashboard` - Dashboard stats

## Predefined Roles

1. **Super Admin** - Full system access
2. **Admin** - User and item management
3. **State Manager** - Demand and approval management
4. **Region Manager** - Approval and stock management
5. **Division Manager** - Approval access
6. **Warehouse Manager** - Stock operations
7. **Production Manager** - Demand creation
8. **Accountant** - Reports access
9. **Regular User** - Basic demand creation
10. **State Office** - Read-only access

## Deployment

### Vercel (Recommended)

1. Push code to GitHub main branch
2. Connect repo to Vercel
3. Set environment variables:
   - `POSTGRES_URL`
   - `JWT_SECRET`
   - `SMTP_*` (optional)
4. Deploy

### Docker

```bash
docker-compose up -d
npm install
npx prisma migrate deploy
npm run build
npm start
```

## Development

### Run dev server
```bash
npm run dev
```

### Generate Prisma types
```bash
npx prisma generate
```

### Run migrations
```bash
npx prisma migrate dev --name <migration-name>
```

### Seed database
```bash
npm run prisma:seed
```

## Security Notes

- Change default admin password immediately
- Set strong JWT_SECRET
- Use HTTPS in production
- Configure CORS as needed
- Keep dependencies updated

## Support

For issues or questions, please create an GitHub issue.

## License

MIT License
