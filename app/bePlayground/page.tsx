"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function Example() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-[60px] grid grid-cols-12 grid-rows-6 h-screen gap-2 ">
      {/* <h1>testttttttttttttttttttttttttestttttttttttttttttttttttttestttttttttttttttttttttttttestttttttttttttttttttttttttestttttttttttttttttttttttttestttttttttttttttttttttttttestttttttttttttttttttttttttestttttttttttttttttttttttt</h1> */}
      <div
        className={`${open ? "col-span-5 row-span-6 bg-green-500" : "col-span-12 row-span-6 bg-red-400"}`}
      >
        <h1>test</h1>
        <button
          onClick={() => {
            setOpen(!open);
          }}
        >
          {" "}
          toggle
        </button>
      </div>

      <Transition show={open} as={Fragment}>
        <Dialog className="relative z-10" onClose={setOpen}>
          {/* <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed  bg-gray-800 bg-opacity-75 transition-opacity" />
          </TransitionChild> */}

          <div className="">
            <div className="">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto relative w-screen max-w-md">
                    <TransitionChild
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4 bg-black">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white "
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                        </button>
                      </div>
                    </TransitionChild>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Panel title
                        </DialogTitle>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Your content */}
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
// import ReactJson from "react-json-view";
// import { ChangeEvent, useEffect, useState } from "react";
// import { useRoleContext } from "@/context/roleContext";
// import { CourseService } from "@/lib/supabase/courseRequests";
// import { EnrollmentService } from "@/lib/supabase/enrollmentRequests";
// import { SupabaseResponse } from "@/models/requestModels";
// import { Database } from "@/types/supabase";
// import Form, { FormProps } from "react-bootstrap/Form";
// import { BucketService } from "@/lib/supabase/BucketRequests";

// export default function Home() {
//   const { role } = useRoleContext();

//   const { user, isSignedIn } = useUser();
//   const { isLoaded, userId: maybeUserId, sessionId, getToken } = useAuth();
//   const userId = maybeUserId || "";

//   const [course, setCourse] =
//     useState<
//       SupabaseResponse<
//         Array<Database["public"]["Tables"]["course"]["Row"] | null>
//       >
//     >();

//   const [loading, setLoading] = useState(true);

//   const [imageUrlList, setImageUrlList] = useState<Array<String>>([]);
//   const [file, setFile] = useState<File>();
//   const [queryParam, setQueryParam] = useState<string>(
//     `?timestamp=${new Date().getTime()}`,
//   ); // temporary hack to trigger reload image

//   useEffect(() => {
//     const initializePage = async () => {
//       try {
//         const token = await getToken({ template: "supabase" });

//         const course = await EnrollmentService.getFullCourse({ userId, token });
//         setCourse(course); // may require frontend side to filter null -> can use Array.filter
//         console.log("course ->", course);

//         const fullCourse = await EnrollmentService.getFullCourse({
//           userId,
//           token,
//         });
//         console.log("FULL COURSE -> ", fullCourse);

//         // const fetchedImages = await BucketService.getImageList({
//         //   token,
//         //   folderPath: "3/course",
//         //   // This is relative course_assets bucket
//         //   // To get the public url for an image -> process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL + courseId + <course|lesson> + image name
//         // });

//         setLoading(false);
//       } catch (error) {
//         console.log("[ERROR DURING PAGE LOAD]: ", error);
//       }
//     };

//     initializePage();
//   }, []);

//   const handleSubmit = async (event: any) => {
//     event.preventDefault();
//     const token = await getToken({ template: "supabase" });
//     const createdCourse = await CourseService.createCourse({
//       userId,
//       token,
//       title: event.target[0].value,
//       description: null,
//     });
//     setCourse(createdCourse);
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   const enrollUser = async (event: any) => {
//     event.preventDefault();
//     const token = await getToken({ template: "supabase" });
//     const createdCourse = await EnrollmentService.enrollByCourseId({
//       userId,
//       token,
//       courseId: event.target[0].value as number,
//     });
//   };

//   const saveFile = (event: ChangeEvent<HTMLInputElement>) => {
//     const fileList = event.target.files;
//     if (fileList && fileList.length > 0) {
//       setFile(fileList[0]);
//     } else {
//       console.log("No file is chosen");
//     }
//   };

//   const uploadImage = async () => {
//     console.log("start upload");
//     if (file) {
//       console.log("uploading");
//       const token = await getToken({ template: "supabase" });
//       await BucketService.uploadFile({
//         token,
//         userId,
//         courseId: 3,
//         file,
//       });
//       setQueryParam(`?timestamp=${new Date().getTime()}`);
//     } else {
//       console.log("There is no file selected");
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <>
//       <UserButton afterSignOutUrl="/" />
//       <div>isLoaded: {isLoaded.toString()}</div>
//       <div>sessionId: {sessionId}</div>
//       <h2>
//         Your role is <b>{role}</b>
//       </h2>
//       {isSignedIn ? (
//         <div className="p-3">
//           <p className="text-3xl font-medium text-sky-700">
//             A backend playground for testing supabase DB call
//           </p>
//           <br />
//           Course of this user: {userId}
//           <br />
//           {/* {course?.data?.map((row) => (
//             <ReactJson src={row || {}} key={row?.course_id} />
//           ))} */}
//           <br />
//           <br />
//           <h1 className="text-3xl font-medium text-sky-700">
//             Teacher functions
//           </h1>
//           <h3>
//             Add course - this function shoud be guarded by frontend using
//             roleContext
//           </h3>
//           <form onSubmit={handleSubmit}>
//             <Input placeholder="course title [IF WANT TO TEST DESCRIPTION -> NEED TO CREATE A FORM]" />
//             <Button>Add course</Button>
//           </form>
//           <h1>Student functions</h1>
//           <h3>Enroll the user in a course</h3>
//           <form onSubmit={enrollUser}>
//             <Input placeholder="course id" />
//             <Button>Enroll</Button>
//           </form>
//           <hr className="mt-5 mb-5 h-1 bg-slate-400" />
//           <h1 className="text-3xl font-medium text-green-700">
//             Image create and get DEMO
//           </h1>
//           <Form.Group>
//             <Form.Control
//               type="file"
//               onChange={(e) => saveFile(e as ChangeEvent<HTMLInputElement>)}
//             ></Form.Control>
//             <button
//               className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
//               onClick={uploadImage}
//             >
//               Save image
//             </button>
//           </Form.Group>
//           <img
//             src={
//               process.env.NEXT_PUBLIC_COURSE_ASSETS_BASE_URL +
//               "3/course/cover" +
//               queryParam
//             }
//           ></img>
//         </div>
//       ) : (
//         <div>
//           <p>please sign in</p>
//           <SignInButton mode="modal" />
//         </div>
//       )}
//     </>
//   );
// }
