import {
  Home,
  Airplay,
  Circle,
  BookOpen,
  Users,
  MessageCircle,
  File,
  Grid,
  Command,
} from "react-feather";

export default [
  {
    id: "home",
    title: "داشبورد",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  // {
  //   id: "smaplePage",
  //   title: "Sample Page",
  //   icon: <Airplay size={20} />,
  //   children: [
  //     {
  //       id: "invoiceList",
  //       title: "List",
  //       icon: <Circle size={12} />,
  //       navLink: "/apps/invoice/list",
  //     },
  //   ],
  // },
  {
    id: "UsersPage",
    title: "مدیریت کاربران",
    icon: <Users size={20} />,
    navLink: "/users",
  },
  {
    id: "CoursesPage",
    title: "مدیریت دوره ها",
    icon: <BookOpen size={20} />,
    children: [
      {
        id: "CoursesList",
        title: "لیست دوره ها",
        icon: <Circle size={12} />,
        navLink: "/courses",
      },
      {
        id: "CoursesReserveList",
        title: "لیست دوره های رزرو شده",
        icon: <Circle size={12} />,
        navLink: "/reserve-list",
      },
      {
        id: "TeacherCourses",
        title: "لیست دوره های استاد",
        icon: <Circle size={12} />,
        navLink: "/teacher-courses",
      },
      {
        id: "AddNewCourse",
        title: "افزودن دوره جدید",
        icon: <Circle size={12} />,
        navLink: "/add-course",
      },
      {
        id: "Techs",
        title: "لیست تکنولوژی ها",
        icon: <Circle size={12} />,
        navLink: "/techs",
      },
      {
        id: "Status",
        title: "لیست وضعیت ها",
        icon: <Circle size={12} />,
        navLink: "/status",
      },
      {
        id: "CourseLevel",
        title: "لیست سطح های دوره",
        icon: <Circle size={12} />,
        navLink: "/courseLevel",
      },
    ],
  },
  {
    id: "ComplexPage",
    title: "مدیریت مجموعه ها",
    icon: <Grid size={20} />,
    children: [
      {
        id: "Building",
        title: "لیست ساختمان ها",
        icon: <Circle size={12} />,
        navLink: "/building",
      },
      {
        id: "ClassRoom",
        title: "لیست کلاس ها",
        icon: <Circle size={12} />,
        navLink: "/classRooms",
      },
      {
        id: "Department",
        title: "لیست دپارتمان ها",
        icon: <Circle size={12} />,
        navLink: "/departments",
      },
      {
        id: "Term",
        title: "لیست ترم ها",
        icon: <Circle size={12} />,
        navLink: "/terms",
      },
    ],
  },
  {
    id: "AssistancePage",
    title: "مدیریت پشتیبانی دوره ها",
    icon: <Command size={20} />,
    children: [
      {
        id: "CourseAssistance",
        title: "لیست پشتیبان ها",
        icon: <Circle size={12} />,
        navLink: "/courseAssistance",
      },
      {
        id: "AssistanceWork",
        title: "لیست تسک های پشتیبان ها",
        icon: <Circle size={12} />,
        navLink: "/assistanceWork",
      },
    ],
  },
  {
    id: "ArticlesPage",
    title: "مدیریت اخبار و مقالات",
    icon: <File size={20} />,
    children: [
      {
        id: "ArticlesList",
        title: "لیست اخبار و مقالات",
        icon: <Circle size={12} />,
        navLink: "/articles",
      },
      {
        id: "ArticleCategoryList",
        title: "لیست دسته بندی ها",
        icon: <Circle size={12} />,
        navLink: "/articleCategoryList",
      },
      {
        id: "AddNewArticle",
        title: "افزودن اخبار و مقالات جدید",
        icon: <Circle size={12} />,
        navLink: "/add-news",
      },
    ],
  },
  {
    id: "CommentsPage",
    title: "مدیریت کامنت ها",
    icon: <MessageCircle size={20} />,
    navLink: "/comments",
  },
];
