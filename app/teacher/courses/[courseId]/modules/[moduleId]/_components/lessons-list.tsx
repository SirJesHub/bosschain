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

interface Lesson {
  lesson_id: string;
  title: string;
  is_published: boolean;
  isFree: boolean;
}

interface LessonsListProps {
  items: Lesson[];
  moduleId: string;
  userId: string;
  token: string;
  onReorder: (updateData: { lesson_id: string; position: number }[]) => void;
  onEdit: (lesson_id: string) => void;
}

export const LessonsList = ({
  moduleId,
  userId,
  token,
  onReorder,
  onEdit,
}: LessonsListProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonData = await EnrollmentService.getLessonByModuleId({
          userId,
          moduleId,
          token,
        });
        if (lessonData && lessonData.data) {
          setLessons(lessonData.data);
          setIsMounted(true);
        }
      } catch (error) {
        console.error("Error fetching lesson data:", error);
      }
    };

    fetchData();
  }, [moduleId, userId, token]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const updatedLessons = Array.from(lessons);
    const [reorderedLesson] = updatedLessons.splice(result.source.index, 1);
    updatedLessons.splice(result.destination.index, 0, reorderedLesson);

    console.log("Updated Lessons after reorder:", updatedLessons);

    setLessons(updatedLessons);

    const bulkUpdateData = updatedLessons.map((lesson, index) => ({
      lesson_id: lesson.lesson_id,
      position: index,
    }));

    try {
      await onReorder(bulkUpdateData);
      console.log("Lessons reordered successfully");
    } catch (error) {
      console.error("Error reordering lessons:", error);
      // Rollback the changes if there's an error
      setLessons(lessons);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lessons">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {lessons.map((lesson, index) => {
              console.log("Draggable ID:", lesson.lesson_id); // Log the draggableId value
              return (
                <Draggable
                  key={String(lesson.lesson_id)}
                  draggableId={String(lesson.lesson_id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        lesson.is_published &&
                          "bg-sky-100 border-sky-200 text-sky-700",
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                          lesson.is_published &&
                            "border-r-sky-200 hover:bg-sky-200",
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      {lesson.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {lesson.isFree && <Badge>Free</Badge>}
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            lesson.is_published && "bg-sky-700",
                          )}
                        >
                          {lesson.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          onClick={() => onEdit(lesson.lesson_id)}
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
