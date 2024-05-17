import React, { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import { CourseService } from "@/lib/supabase/courseRequests";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DescriptionFormProps {
  initialData: { description: string } | null;
  courseId: string;
  token: string;
  userId: string;
  onDescriptionUpdate: (updatedDescription: string) => void; // Callback function to handle title update
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

export const DescriptionForm = ({
  initialData,
  courseId,
  token,
  userId,
  onDescriptionUpdate,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const data = await EnrollmentService.updateCourseDescription({
        courseId: Number(courseId),
        userId,
        description: values.description,
        token,
      });

      const course_id = parseInt(courseId);
      const response = await CourseService.updateCourseAlgolia(
        "description",
        course_id,
        undefined,
        values.description,
        undefined,
      );
      console.log(response);

      if (data.error) {
        console.log("[updateCourseDescription ERROR]: ", data.error);
        toast.error(data.error); // Display error message to user
        return;
      } else if (data.error) {
        console.log(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log("Course description updated successfully!");
        toast.success("Course description updated successfully!");
      }

      toggleEdit();

      // Call the callback function to handle title update
      onDescriptionUpdate(values.description);
    } catch (error) {
      console.error("[updateCourseDescription ERROR]: ", error);
      toast.error("Something went wrong while updating course description.");
    }
  };

  useEffect(() => {
    if (isEditing) {
      form.setValue("description", initialData?.description || "");
    }
  }, [isEditing, initialData?.description]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData?.description}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g. 'This course teaches about crypto'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
