import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-3">
      <p className="text-3xl font-medium text-sky-700">Welcome to Bosschain</p>
      <Button variant="default">Button from shadcn-ui</Button>
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
}
