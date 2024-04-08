// export let userLearningData = {
//     username: "exampleUser",
//     progress: [
//       {
//         weekNumber: 1,
//         lessons: [
//           { lessonNumber: 1, status: "completed" },
//           { lessonNumber: 2, status: "completed" },
//         ],
//       },
//       {
//         weekNumber: 2,
//         lessons: [
//           { lessonNumber: 3, status: "not-started" },
//           { lessonNumber: 4, status: "completed" },
//         ],
//       },
//       {
//         weekNumber: 3,
//         lessons: [
//           { lessonNumber: 5, status: "not-started" },
//           { lessonNumber: 6, status: "not-started" },
//         ],
//       },
//       {
//         weekNumber: 4,
//         lessons: [
//           { lessonNumber: 7, status: "not-started" },
//           { lessonNumber: 8, status: "not-started" },
//         ],
//       },
//     ],
//   };
//change module_id to moduleIndex
export let userLearningData = {
  username: "exampleUser",
  progress: [
    {
      module_id: 0,
      lesson: [
        { lesson_id: 0, status: "not-started" },
        { lesson_id: 1, status: "completed" },
        { lesson_id: 2, status: "not-started" },
        { lesson_id: 3, status: "completed" },
      ],
    },
    {
      module_id: 1,
      lesson: [
        { lesson_id: 4, status: "completed" },
      ],
    },
    {
      module_id: 2,
      lesson: [
        { lesson_id: 5, status: "completed" },
      ],
    },
  ],
};



