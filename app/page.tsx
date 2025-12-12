import { redirect } from "next/navigation";

export default function Home() {
  
  redirect('/dashboard/')

  return (
    <div className="bg-amber-200 w-full h-screen min-h-screen">
      <h1>hello</h1>
    </div>
  );
}
