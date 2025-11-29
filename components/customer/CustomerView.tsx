"use client";

import { customerType } from "@/lib/actions/customers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CustomerView({ customer }: { customer: customerType }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/customers/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: customer.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      router.refresh();
    } catch (err) {
      console.error("Delete customer error", err);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Customer Info */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Avatar className="w-16 h-16 border">
            <AvatarImage src={customer.imageUrl || ""} alt={customer.name} />
            <AvatarFallback>
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-lg">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Link href={`/dashboard/customers/${customer.id}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              View
            </Button>
          </Link>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isDeleting}
                className="w-fit px-2 py-1 sm:w-auto"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Customer?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove{" "}
                  <span className="font-semibold">{customer.name}</span> from your records.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
