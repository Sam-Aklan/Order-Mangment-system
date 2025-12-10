import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  // Or a custom loading skeleton component
  return <p className="absolute inset-0 bg-background  text-7xl h-screen w-full flex justify-center items-center">
    <Spinner className="size-12 text-primary"/>
  </p>
}