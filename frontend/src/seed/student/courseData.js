export const courseData = {
  title: "Advanced React Patterns & Performance Optimization",
  progress: 35,
  instructor: {
    name: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    avatar: "https://i.pravatar.cc/150?img=35",
    students: "12,403 Students",
    rating: "4.9/5.0",
  },
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
};