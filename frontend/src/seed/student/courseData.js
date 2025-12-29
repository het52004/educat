export const courseData = [
  {
    id: 1,
    title: "React for beginners",
    description:
      "Understand React fundamentals, components, and state management.",
    price: "$2.49",
    progress: 35,
    instructor: {
      name: "Sarah Jenkins",
      role: "Senior Frontend Engineer",
      avatar: "https://i.pravatar.cc/150?img=35",
      students: "12,403 Students",
      rating: "4.9/5.0",
    },
    image: "https://placehold.co/600x400/5C6BC0/white?text=React",
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
            videoUrl: "BYbgopx44vo",
          },
          {
            id: 102,
            title: "Reconciliation Strategy",
            time: "08:15",
            type: "video",
            completed: true,
            videoUrl: "TNhaISOUy6Q",
          },
          {
            id: 103,
            title: "Fiber Architecture Explained",
            time: "22:30",
            type: "video",
            completed: false,
            active: true,
            videoUrl: "ZCuYPiUIONs",
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
            videoUrl: "wU57kvYOxT4",
          },
          {
            id: 202,
            title: "Custom Hooks for Data Fetching",
            time: "19:10",
            type: "video",
            completed: false,
            videoUrl: "6ThXsUwLWvc",
          },
        ],
      },
    ],
  },
];

export default courseData;
