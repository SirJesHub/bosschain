import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";

interface Module {
  module_id: string;
  title: string;
  isPublished: boolean;
  isFree: boolean;
}

interface ModulesListProps {
  items: Module[];
  courseId: string;
  userId: string;
  token: string;
  onReorder: (updateData: { module_id: string; position: number }[]) => void;
  onEdit: (module_id: string) => void;
}

export const ModulesList = ({
  courseId,
  userId,
  token,
  onReorder,
  onEdit,
}: ModulesListProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moduleData = await EnrollmentService.getModuleByCourseId({
          userId,
          courseId,
          token,
        });
        if (moduleData && moduleData.data) {
          setModules(moduleData.data);
          setIsMounted(true);
        }
      } catch (error) {
        console.error("Error fetching module data:", error);
      }
    };

    fetchData();
  }, [courseId, userId, token]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const updatedModules = Array.from(modules);
    const [reorderedModule] = updatedModules.splice(result.source.index, 1);
    updatedModules.splice(result.destination.index, 0, reorderedModule);

    console.log("Updated Modules after reorder:", updatedModules);

    setModules(updatedModules);

    const bulkUpdateData = updatedModules.map((module, index) => ({
      module_id: module.module_id,
      position: index,
    }));

    try {
      await onReorder(bulkUpdateData);
      console.log("Modules reordered successfully");
    } catch (error) {
      console.error("Error reordering modules:", error);
      // Rollback the changes if there's an error
      setModules(modules);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {modules.map((module, index) => {
              console.log("Draggable ID:", module.module_id); // Log the draggableId value
              return (
                <Draggable
                  key={String(module.module_id)}
                  draggableId={String(module.module_id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        module.isPublished &&
                          "bg-sky-100 border-sky-200 text-sky-700",
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                          module.isPublished &&
                            "border-r-sky-200 hover:bg-sky-200",
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      {module.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {module.isFree && <Badge>Free</Badge>}
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            module.isPublished && "bg-sky-700",
                          )}
                        >
                          {module.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          onClick={() => onEdit(module.module_id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
