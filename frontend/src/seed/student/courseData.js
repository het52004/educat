export const courseData = [
  {
    id: 1,
    title: "Advanced React Patterns & Performance Optimization",
    description:
      "Master advanced React patterns, performance optimization, and internal architecture.",
    price: "$49.99",
    progress: 35,
    instructor: {
      name: "Sarah Jenkins",
      role: "Senior Frontend Engineer",
      avatar: "https://i.pravatar.cc/150?img=35",
      students: "12,403 Students",
      rating: "4.9/5.0",
    },
    image: "https://placehold.co/600x400/5C6BC0/white?text=React+Patterns",
    rating: 4.9,
    duration: "10h 30m",
    lectures: 12,
    sections: [
      {
        id: 1,
        title: "Module 1: React Internals",
        lessons: [
          {
            id: 101,
            title: "Understanding the Virtual DOM",
            time: "10:00",
            type: "video",
            completed: true,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            id: 102,
            title: "Reconciliation Strategy",
            time: "08:15",
            type: "video",
            completed: true,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
          {
            id: 103,
            title: "Fiber Architecture Explained",
            time: "22:30",
            type: "video",
            completed: false,
            active: true,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
        ],
      },
      {
        id: 2,
        title: "Module 2: Advanced Hooks",
        lessons: [
          {
            id: 201,
            title: "useLayoutEffect vs useEffect",
            time: "06:45",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          },
          {
            id: 202,
            title: "Custom Hooks for Data Fetching",
            time: "19:10",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    description:
      "Become a full stack developer with React, Node.js, and MongoDB.",
    price: "$59.99",
    progress: 10,
    instructor: {
      name: "John Doe",
      role: "Full Stack Developer",
      avatar: "https://i.pravatar.cc/150?img=12",
      students: "8,200 Students",
      rating: "4.7/5.0",
    },
    image: "https://placehold.co/600x400/26A69A/white?text=Full+Stack",
    rating: 4.7,
    duration: "24h 10m",
    lectures: 45,
    sections: [
      {
        id: 1,
        title: "Module 1: Node.js Fundamentals",
        lessons: [
          {
            id: 201,
            title: "Introduction to Node.js Runtime",
            time: "12:30",
            type: "video",
            completed: true,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          },
          {
            id: 202,
            title: "Modules and Require System",
            time: "15:45",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          },
        ],
      },
      {
        id: 2,
        title: "Module 2: Database Design with MongoDB",
        lessons: [
          {
            id: 203,
            title: "NoSQL vs SQL",
            time: "08:20",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          },
          {
            id: 204,
            title: "Modeling Data with Mongoose",
            time: "20:10",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    description:
      "Learn to design beautiful user interfaces and user experiences.",
    price: "$39.99",
    progress: 0,
    instructor: {
      name: "Emily White",
      role: "Product Designer",
      avatar: "https://i.pravatar.cc/150?img=25",
      students: "5,000 Students",
      rating: "4.8/5.0",
    },
    image: "https://placehold.co/600x400/EF5350/white?text=UI+UX",
    rating: 4.8,
    duration: "15h 00m",
    lectures: 20,
    sections: [
      {
        id: 1,
        title: "Module 1: Design Principles",
        lessons: [
          {
            id: 301,
            title: "Color Theory & Psychology",
            time: "14:00",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          },
          {
            id: 302,
            title: "Typography Mastery",
            time: "11:30",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
          },
        ],
      },
      {
        id: 2,
        title: "Module 2: Figma Essentials",
        lessons: [
          {
            id: 303,
            title: "Setting up your Workspace",
            time: "09:45",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
          {
            id: 304,
            title: "Components and Variants",
            time: "18:20",
            type: "video",
            completed: false,
            videoUrl:
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
        ],
      },
    ],
  },
];

export default courseData;
