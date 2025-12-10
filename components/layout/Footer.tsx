"use client";

import Link from "next/link";
import { Mail, Twitter, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-chart-5 border-t mt-16 text-background">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/** BRAND SECTION */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-chart-1 to-chart-3 flex items-center justify-center  font-bold">
              OM
            </div>
            <span className="text-xl font-semibold">OrderManager</span>
          </Link>

          <p className="text-sm text-background mt-3 max-w-xs">
            Simple full-stack order management — orders, inventory, customers, and insights.
          </p>

          <div className="flex items-center gap-2 mt-4 flex-wrap text-foreground">
            <Button asChild size="sm" variant="outline">
              <Link aria-label="Email" href="mailto:hello@example.com">
                <Mail size={16} />
              </Link>
            </Button>

            <Button asChild size="sm" variant="outline">
              <Link
                aria-label="GitHub"
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} />
              </Link>
            </Button>

            <Button asChild size="sm" variant="outline">
              <Link
                aria-label="Twitter"
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={16} />
              </Link>
            </Button>
          </div>
        </div>

        {/** MOBILE ACCORDION */}
        <div className="block md:hidden">
          <Accordion type="multiple" className="w-full">

            {/* Product */}
            <AccordionItem value="product">
              <AccordionTrigger>Product</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 mt-2 text-sm">
                  <Link href="/dashboard/orders" className="hover:underline">Orders</Link>
                  <Link href="/dashboard/products" className="hover:underline">Products</Link>
                  <Link href="/dashboard/customers" className="hover:underline">Customers</Link>
                  <Link href="/dashboard/insights" className="hover:underline">Insights</Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Company */}
            <AccordionItem value="company">
              <AccordionTrigger>Company</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 mt-2 text-sm">
                  <Link href="/about" className="hover:underline">About</Link>
                  <Link href="/terms" className="hover:underline">Terms</Link>
                  <Link href="/privacy" className="hover:underline">Privacy</Link>
                  <Link href="/contact" className="hover:underline">Contact</Link>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Updates */}
            <AccordionItem value="updates">
              <AccordionTrigger>Updates</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-background mb-4">
                  Get occasional updates about new features.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const email = new FormData(e.currentTarget).get("email");
                    alert(`Subscribed: ${email}`);
                  }}
                  className="flex flex-col gap-3 w-full"
                >
                  <input
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    className="px-3 py-2 w-full rounded border"
                  />
                  <Button type="submit" className="w-full">Join</Button>
                </form>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/** DESKTOP 4-COLUMN LAYOUT */}
        <div className="hidden md:grid grid-cols-4 gap-8">
          <div />

          {/* Product */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/dashboard/orders" className="hover:underline">Orders</Link>
              <Link href="/dashboard/products" className="hover:underline">Products</Link>
              <Link href="/dashboard/customers" className="hover:underline">Customers</Link>
              <Link href="/dashboard/insights" className="hover:underline">Insights</Link>
            </nav>
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </nav>
          </div>

          {/* Updates */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Updates</h4>
            <p className="text-sm text-background mb-3">
              Subscribe for new features & announcements.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = new FormData(e.currentTarget).get("email");
                alert(`Subscribed: ${email}`);
              }}
              className="flex items-center gap-2"
            >
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                className="px-3 py-2 rounded border w-full"
              />
              <Button type="submit" size="sm">Join</Button>
            </form>
          </div>
        </div>

        <Separator />

        {/** FOOTER BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background">
          <div className="text-center md:text-left">
            © {year} OrderManager • Built with ❤️ and Next.js
          </div>

          <div className="flex items-center gap-4">
            <Link href="/status" className="hover:underline">Status</Link>
            <Link href="/security" className="hover:underline">Security</Link>
            <Link href="/docs" className="hover:underline">Docs</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
