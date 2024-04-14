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

interface TitleFormProps {
  initialData: { title: string } | null;
  moduleId: string;
  token: string;
  userId: string;
  onTitleUpdate: (updatedTitle: string) => void; // Callback function to handle title update
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const TitleForm = ({
  initialData,
  moduleId,
  token,
  userId,
  onTitleUpdate,
}: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }
      const data = await EnrollmentService.updateModuleTitle({
        moduleId: Number(moduleId),
        userId,
        title: values.title,
        token,
      });

      if (
        data.error ==
        'duplicate key value violates unique constraint "unique_module_title"'
      ) {
        console.log("[updateModuleTitle ERROR]: ", data.error);
        toast.error("Title Already Exists"); // Display error message to user
        return;
      } else if (data.error) {
        console.log(data.error);
        toast.error("Something went wrong. Please try again"); // Display error message to user
        return;
      } else {
        // Success case, handle as needed
        console.log("Module title updated successfully!");
        toast.success("Module title updated successfully!");
      }

      toggleEdit();

      // Call the callback function to handle title update
      onTitleUpdate(values.title);
    } catch (error) {
      console.error("[updateModuleTitle ERROR]: ", error);
      toast.error("Something went wrong while updating module title.");
    }
  };

  useEffect(() => {
    if (isEditing) {
      form.setValue("title", initialData?.title || "");
    }
  }, [isEditing, initialData?.title]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Module title
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData?.title}</p>}
      {isEditing && (
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
                      placeholder="e.g. 'Introduction to the course'"
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
