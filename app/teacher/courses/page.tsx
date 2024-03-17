import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

// Define the type for a course
interface Course {
  id: number;
  title: string;
  price: number;
  isPublished: boolean;
  createdAt: Date;
}

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // Mock data instead of querying from the database
  const mockCourses: Course[] = [
    {
      id: 1,
      title: "Course 1",
      price: 99.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Course 2",
      price: 149.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 3,
      title: "Course 3",
      price: 79.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 4,
      title: "Course 4",
      price: 129.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 5,
      title: "Course 5",
      price: 199.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 6,
      title: "Course 6",
      price: 69.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 7,
      title: "Course 7",
      price: 159.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 8,
      title: "Course 8",
      price: 119.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 9,
      title: "Course 9",
      price: 89.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 10,
      title: "Course 10",
      price: 149.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 11,
      title: "Course 11",
      price: 109.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 12,
      title: "Course 12",
      price: 169.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 13,
      title: "Course 13",
      price: 129.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 14,
      title: "Course 14",
      price: 79.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 15,
      title: "Course 15",
      price: 189.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 16,
      title: "Course 16",
      price: 99.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 17,
      title: "Course 17",
      price: 139.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 18,
      title: "Course 18",
      price: 119.99,
      isPublished: true,
      createdAt: new Date(),
    },
    {
      id: 19,
      title: "Course 19",
      price: 69.99,
      isPublished: false,
      createdAt: new Date(),
    },
    {
      id: 20,
      title: "Course 20",
      price: 159.99,
      isPublished: true,
      createdAt: new Date(),
    },
  ];

  return (
    <div className="p-6">
      <DataTable columns={columns} data={mockCourses} />
    </div>
  );
};

export default CoursesPage;
