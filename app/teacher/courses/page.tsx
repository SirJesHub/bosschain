"use client";
import { useEffect, useState } from "react";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import NavBar from "@/components/nav-bar";
import { useRoleContext } from "@/context/roleContext";
import { Role } from "@/constants/auth";
import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";

// Define the type for a course
interface Course {
  id: number;
  title: string;
  price: number;
  isPublished: boolean;
  createdAt: Date;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]); // State to store fetched courses
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const { role } = useRoleContext();
  const { user, isSignedIn } = useUser();
  const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (isSignedIn) {
      setUserId(user.id);
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (userId) {
      fetchCourses();
    }
  }, [userId]);

  const fetchCourses = async () => {
    try {
      setLoading(true); // Set loading to true when fetching courses
      const token = await getToken({ template: "supabase" });
      const { data } = await EnrollmentService.getAllTeacherCourse({
        userId,
        token,
      });
      console.log(data);
      if (data) {
        const formattedCourses: Course[] = data.map((course) => ({
          id: course?.course_id || 0, // Use a default value if course is null
          title: course?.title || "", // Ensure title is not null
          price: 0, // You need to determine how to get the price data
          isPublished: course?.is_published || false, // Ensure is_published is not null
          createdAt: course ? new Date(course.created_at) : new Date(), // Convert string to Date object
        }));

        setCourses(formattedCourses);
      } else {
        setCourses([]); // Set empty array if no data is returned
      }
    } catch (error) {
      console.log("[ERROR DURING FETCHING COURSES]: ", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete
    }
  };

  if (!isSignedIn) {
    return <p>Loading...</p>;
  }

  // Render loading indicator while fetching courses
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!courses.length) {
    return <p>No courses found</p>;
  }

  // If the user is not a teacher, display a message
  if (role !== "teacher") {
    return (
      <div className="p-6 text-center">
        <p>Sign up to be a teacher to view this page</p>
      </div>
    );
  }

  return (
    <div className="pt-[69px] h-full w-full overflow-hidden">
      <div className="p-3 h-full">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CoursesPage;
