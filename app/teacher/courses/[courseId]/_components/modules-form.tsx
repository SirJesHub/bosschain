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

import { ModulesList } from "./modules-list";

interface Module {
  module_id: string;
  title: string;
  is_published: boolean;
  isFree: boolean;
}

interface ModulesFormProps {
  initialData: {
    modules: Module[]; // Add modules property
  };
  courseId: string;
  userId: string; // Add userId property
  token: string; // Add token property
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ModulesForm = ({
  initialData,
  courseId,
  userId,
  token, // Add userId and token here
}: ModulesFormProps) => {
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

      console.log(courseId);

      let moduleIndexList = await EnrollmentService.getLatestModuleIndex({
        userId,
        token,
        courseId,
      });

      console.log(moduleIndexList);

      let response: any = undefined;

      if (moduleIndexList.data !== null && moduleIndexList.data.length > 0) {
        response = await EnrollmentService.createModule({
          userId: userId,
          token: token,
          title: values.title,
          description: "",
          courseId: Number(courseId),
          index: moduleIndexList.data[0]?.index + 1, // Use optional chaining (?.) to access properties safely
        });
      } else {
        console.log("moduleIndexList.data is null or empty.");

        response = await EnrollmentService.createModule({
          userId: userId,
          token: token,
          title: values.title,
          description: "",
          courseId: Number(courseId),
          index: 0, // Use optional chaining (?.) to access properties safely
        });
      }

      if (
        response.error ==
        'duplicate key value violates unique constraint "unique_module_title"'
      ) {
        console.log("[updateModuleTitle ERROR]: ", response.error);
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
        response.data[0].module_id
      ) {
        const moduleId = response.data[0].module_id;
        toast.success("Module created successfully");
        setIsCreating(false);
      } else {
        toast.error("Failed to create module");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (
    updateData: { module_id: string; position: number }[],
  ) => {
    try {
      setIsUpdating(true);

      console.log("Updating modules with:", updateData);

      const response = await EnrollmentService.moduleIndexReorder({
        userId: userId,
        token: token,
        req: updateData,
      });

      console.log("Reorder response:", response);

      toast.success("Modules reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error reordering modules:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/modules/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course modules
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a module
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
                      placeholder="e.g. 'Introduction to the course'"
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
      {!isCreating && initialData.modules && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.modules.length && "text-slate-500 italic",
          )}
        >
          {!initialData.modules.length && "No modules"}
          <ModulesList
            items={initialData.modules} // Make sure items property is included
            onEdit={onEdit}
            onReorder={onReorder}
            courseId={courseId} // Pass courseId
            userId={userId} // Pass userId
            token={token} // Pass token
          />
        </div>
      )}

      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the modules
        </p>
      )}
    </div>
  );
};
