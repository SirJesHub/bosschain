export let courseInformation = {
    title: "Web Development Fundamentals",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    weeks: [
      {
        weekNumber: 1,
        weekTitle: "Introduction to Web Development",
        //description
        lessons: [
          {
            lessonNumber: 1,
            //lessonType:
            lessonTitle: "Understanding the Web",
            description:
              "Research and summarize the history of the World Wide Web",
          },
          {
            lessonNumber: 2,
            lessonTitle: "Basics of HTML",
            description: "Create a simple HTML page",
          },
        ],
      },
      {
        weekNumber: 2,
        weekTitle: "Styling with CSS",
        lessons: [
          {
            lessonNumber: 3,
            lessonTitle: "Introduction to CSS",
            description: "Style the HTML page created in Week 1 using CSS",
          },
          {
            lessonNumber: 4,
            lessonTitle: "Advanced CSS Techniques",
            description: "Implement responsive design using media queries",
          },
        ],
      },
      {
        weekNumber: 3,
        weekTitle: "JavaScript Basics",
        lessons: [
          {
            lessonNumber: 5,
            lessonTitle: "Introduction to JavaScript",
            description: "Write a simple JavaScript program",
          },
          {
            lessonNumber: 6,
            lessonTitle: "DOM Manipulation",
            description:
              "Manipulate the DOM to dynamically update the HTML page",
          },
        ],
      },
      {
        weekNumber: 4,
        weekTitle: "Introduction to Front-end Frameworks",
        lessons: [
          {
            lessonNumber: 7,
            lessonTitle: "Basics of Bootstrap",
            description: "Build a responsive webpage using Bootstrap",
          },
          {
            lessonNumber: 8,
            lessonTitle: "Introduction to React.js",
            description: "Create a simple React component",
          },
        ],
      },
    ],
  };