# Order Management System

![Order Management System Dashboard](./public/order-system.jpeg)

A modern, full-featured **Order Management System** designed to handle products, customers, and order lifecycles. Built on the Next.js App Router and powered by Prisma, PostgreSQL, Better Auth, and Zustand.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (User signup, login, session, and role management)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/) (Manages the complex local cart/order-building state and synchronization)
- **Styling & UI**: Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com/) components, and Lucide React icons
- **Form Handling**: React Hook Form with Zod validation
- **Media Uploads**: Cloudinary integration for product and customer images
- **Data Visualization**: Recharts for dashboard analytics and sales metrics

---

## ✨ Features

### 📊 Analytics Dashboard
- Comprehensive metrics tracking for total sales, order statistics, and customer activity.
- Visualized data trends using responsive charts (powered by Recharts).

### 🛒 Stateful Order Builder
- **Zustand-powered Order Store** (`useOrderStore`) that handles adding/removing items, real-time total price calculation, and customer assignment.
- Support for modifying existing orders, adjusting product quantities with respect to current stock, and handling newly added items vs. original items cleanly.
- Strict order status updates (`PENDING`, `SHIPPED`, `DELIVERED`).

### 📦 Product & Stock Catalog
- Complete CRUD operations for products.
- Product classification under categories (`ELECTRONICS`, `CLOTHING`, `FOOD`, `BOOKS`, `FURNITURE`, `OTHER`).
- Real-time stock status tracking.
- Product images hosted on Cloudinary.

### 👥 Customer Directory
- Database tracking for customers with full contact details and history.
- Seamless search and selection during order creation.

### 🔒 Secure Authentication
- User sign-up, sign-in, and persistent session management powered by Better Auth.
- Support for roles and access control.

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v9+)
- A PostgreSQL database instance

### 2. Installation
Clone the repository and install dependencies:
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and populate it with your keys:
```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000" # Base URL of your app

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Database Setup & Seeding
Deploy migrations to your database and generate the Prisma Client:
```bash
npx prisma db push
# or
npx prisma migrate dev
```

*(Optional)* Seed the database with sample products and customers:
```bash
npx prisma db seed
```

### 5. Running the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
