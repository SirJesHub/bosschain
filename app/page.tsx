"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTest, getTest } from "@/lib/supabase/supabaseRequests";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { userId, getToken } = useAuth();

  const [test, setTest] = useState<any[]>();

  useEffect(() => {
    const loadToTest = async () => {
      const token = await getToken({ template: "supabase" });
      const test = await getTest({ userId, token });
      setTest(test);
    };

    loadToTest();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const token = await getToken({ template: "supabase" });
    const addedTest = await addTest({ userId, token, event });
    const updatedTest = await getTest({ userId, token });
    setTest(updatedTest);
  };

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      {isSignedIn ? (
        <div className="p-3">
          <p className="text-3xl font-medium text-sky-700">
            Welcome to Bosschain
          </p>
          <br />
          {userId}
          <br />
          {JSON.stringify(test)}
          <br />
          <form onSubmit={handleSubmit}>
            <Input placeholder="dummy input" />
            <Button>Dummy add test</Button>
          </form>
        </div>
      ) : (
        <div>
          <p>please sign in</p>
          <SignInButton mode="modal" />
        </div>
      )}
    </>
  );
}
