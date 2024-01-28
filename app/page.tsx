"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPost, getPost } from "@/lib/supabase/supabaseRequests";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import ReactJson from "react-json-view";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { userId, getToken } = useAuth();

  const [post, setPost] = useState<any[]>();

  useEffect(() => {
    const loadToPost = async () => {
      const token = await getToken({ template: "supabase" });
      const post = await getPost({ userId, token });
      setPost(post);
    };

    loadToPost();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const token = await getToken({ template: "supabase" });
    const addedPost = await addPost({ userId, token, event });
    setPost(addedPost);
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
          {post?.map((row) => (
            <ReactJson src={row} />
          ))}
          <br />
          <form onSubmit={handleSubmit}>
            <Input placeholder="dummy input" />
            <Button>Dummy add post</Button>
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
