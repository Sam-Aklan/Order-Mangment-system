// prisma/seed.ts
import { auth } from "@/lib/auth";
import { PrismaClient } from "../generated/prisma";
import { headers } from "next/headers";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  // Promise.all()

  // auth.api.signUpEmail({body:{},headers:await headers()})

  // Seed Products
  const products = await prisma.product.createMany({
    data: [
      { name: "Wireless Mouse", price: 29.99, stock: 100 },
      { name: "Keyboard", price: 49.99, stock: 50 },
      { name: "Monitor 24\"", price: 159.99, stock: 30 },
      { name: "USB-C Cable", price: 9.99, stock: 200 },
    ],
  });

  // Seed Customers
  const customers = await prisma.customer.createMany({
    data: [
      { name: "Alice Smith", email: "alice@example.com" },
      { name: "Bob Johnson", email: "bob@example.com" },
      { name: "Charlie Rose", email: "charlie@example.com" },
    ],
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
