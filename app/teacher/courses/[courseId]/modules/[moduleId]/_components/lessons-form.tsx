"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { useAuth, useUser } from "@clerk/nextjs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { LessonsList } from "./lessons-list";

interface Lesson {
  lesson_id: string;
  title: string;
  isPublished: boolean;
  isFree: boolean;
}

interface LessonsFormProps {
  initialData: {
    lessons: Lesson[]; // Add lessons property
  };
  moduleId: string;
  userId: string; // Add userId property
  token: string; // Add token property
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const LessonsForm = ({
  initialData,
  moduleId,
  userId,
  courseId,
  token, // Add userId and token here
}: LessonsFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = await getToken({ template: "supabase" });
      //const token = "";
      const response = await EnrollmentService.createLesson({
        userId: userId,
        token: token,
        title: values.title,
        description: "",
        moduleId: Number(moduleId),
      });

      if (
        response.error ==
        'duplicate key value violates unique constraint "unique_lesson_title"'
      ) {
        console.log("[updateLessonTitle ERROR]: ", response.error);
        toast.error("Title Already Exists. Please Choose a New Title"); // Display error message to user
        return;
      }

      if (response.error) {
        console.log(response.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      }

      if (response.error) {
        console.log(response.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      }

      if (
        response.data &&
        response.data.length > 0 &&
        response.data[0].lesson_id
      ) {
        const lessonId = response.data[0].lesson_id;
        toast.success("Lesson created successfully");
        setIsCreating(false);
      } else {
        toast.error("Failed to create lesson");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (
    updateData: { lesson_id: string; position: number }[],
  ) => {
    try {
      setIsUpdating(true);

      toast.success("Lessons reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(
      `/teacher/courses/${courseId}/modules/${moduleId}/lessons/${id}`,
    );
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Module lessons
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a lesson
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the module'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && initialData.lessons && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.lessons.length && "text-slate-500 italic",
          )}
        >
          {!initialData.lessons.length && "No lessons"}
          <LessonsList
            items={initialData.lessons} // Make sure items property is included
            onEdit={onEdit}
            onReorder={onReorder}
            moduleId={moduleId} // Pass moduleId
            userId={userId} // Pass userId
            token={token} // Pass token
          />
        </div>
      )}

      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the lessons
        </p>
      )}
    </div>
  );
};
