import React, { useState, useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryFormProps {
  initialData: { category: string } | null;
  courseId: string;
  token: string;
  userId: string;
  onCategoryUpdate: (updatedCategory: string) => void; // Callback function to handle title update
}

const formSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
});

export const CategoryForm = ({
  initialData,
  courseId,
  token,
  userId,
  onCategoryUpdate,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const data = await EnrollmentService.updateCourseCategory({
        courseId: Number(courseId),
        userId,
        category: values.category,
        token,
      });

      if (data.error) {
        console.log("[updateCourseCategory ERROR]: ", data.error);
        toast.error(data.error); // Display error message to user
        return;
      } else if (data.error) {
        console.log(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log("Course category updated successfully!");
        toast.success("Course category updated successfully!");
      }

      toggleEdit();

      // Call the callback function to handle title update
      onCategoryUpdate(values.category);
    } catch (error) {
      console.error("[updateCourseCategory ERROR]: ", error);
      toast.error("Something went wrong while updating course category.");
    }
  };

  useEffect(() => {
    if (isEditing) {
      form.setValue("category", initialData?.category || "");
    }
  }, [isEditing, initialData?.category]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData?.category}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="e.g. 'Cryptocurrency'" {...field} />
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
