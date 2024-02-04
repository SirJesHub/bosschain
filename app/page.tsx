"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addPost, getPost, getUserRole } from "@/lib/supabase/supabaseRequests";
import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import ReactJson from "react-json-view";
import { useEffect, useState } from "react";
import { useRoleContext } from "@/context/roleContext";

export default function Home() {
  const { role, setRole } = useRoleContext();

  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const userId = maybeUserId || "";

  const [post, setPost] = useState<
    {
      created_at: string;
      id: number;
      text: string;
      user_id: string;
    }[]
  >();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const token = await getToken({ template: "supabase" });

        const post = await getPost({ userId, token });
        setPost(post);

        setLoading(false);
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
    };

    initializePage();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const token = await getToken({ template: "supabase" });
    const addedPost = await addPost({ userId, token, event });
    setPost(addedPost);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div>isLoaded: {isLoaded.toString()}</div>
      <div>sessionId: {sessionId}</div>
      <h2>
        Your role is <b>{role}</b>
      </h2>
      {isSignedIn ? (
        <div className="p-3">
          <p className="text-3xl font-medium text-sky-700">
            Welcome to Bosschain
          </p>
          <br />
          {userId}
          <br />
          {post?.map((row) => <ReactJson src={row} key={row.id} />)}
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
