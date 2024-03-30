"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import { CourseService } from "@/lib/supabase/courseRequests"; // Import createCourse function
import { useRoleContext } from "@/context/roleContext";
import { Role } from "@/constants/auth";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import ReactJson from "react-json-view";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { SupabaseResponse } from "@/models/requestModels";
import { Database } from "@/types/supabase";
import { useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const [userId, setUserId] = useState<string>("");
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const [course, setCourse] =
    useState<
      SupabaseResponse<
        Array<Database["public"]["Tables"]["course"]["Row"] | null>
      >
    >();

  useEffect(() => {
    if (isSignedIn) {
      setUserId(user.id);
    }

    const initializePage = async () => {
      try {
        const token = await getToken({ template: "supabase" });

        const course = await EnrollmentService.getFullCourse({ userId, token });
        setCourse(course); // may require frontend side to filter null -> can use Array.filter

        const fullCourse = await EnrollmentService.getFullCourse({ userId, token });
        console.log("FULL COURSE -> ", fullCourse);
      } catch (error) {
        console.log("[ERROR DURING PAGE LOAD]: ", error);
      }
    };

    initializePage();
  }, [isSignedIn, user]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const token = await getToken({ template: "supabase" });
      //const token = "";
      const response = await CourseService.createCourse({
        userId: userId,
        token: token,
        title: values.title,
        description: "",
      });

      if (
        response.error ==
        'duplicate key value violates unique constraint "unique_course_title"'
      ) {
        console.log("[updateCourseTitle ERROR]: ", response.error);
        toast.error("Title Already Exists. Please Choose a New Title"); // Display error message to user
        return;
      }

      if (response.error) {
        console.log(response.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      }

      setCourse(response);
      if (
        response.data &&
        response.data.length > 0 &&
        response.data[0].course_id
      ) {
        const courseId = response.data[0].course_id;
        toast.success("Course created successfully");
        window.location.href = `/teacher/courses/edit/${courseId}`;
      } else {
        toast.error("Failed to create course");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-blue-500"
              >
                Continue
              </Button>

              <br />
              {course?.data?.map((row) => (
                <ReactJson src={row || {}} key={row?.course_id} />
              ))}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
