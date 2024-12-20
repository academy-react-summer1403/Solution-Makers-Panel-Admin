// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/home";

const Home = lazy(() => import("../../pages/Home"));
const SecondPage = lazy(() => import("../../pages/SecondPage"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"));
const Error = lazy(() => import("../../pages/Error"));
const Sample = lazy(() => import("../../pages/Sample"));
const Courses = lazy(() => import("../../pages/Courses"));
const CourseDetails = lazy(() => import("../../pages/CourseDetails"));
const AddNewCourse = lazy(() => import("../../pages/AddNewCourse"));
const CoursesReserveList = lazy(() => import("../../pages/CoursesReserveList"));
const Users = lazy(() => import("../../pages/Users"));
const UserDetails = lazy(() => import("../../pages/UserDetails"));
const Comments = lazy(() => import("../../pages/Comments"));
const Articles = lazy(() => import("../../pages/Articles"));
const ArticleDetails = lazy(() => import("../../pages/ArticleDetails"));
const ArticleCategoryList = lazy(() =>
  import("../../pages/ArticleCategoryList")
);
const AddNewArticle = lazy(() => import("../../pages/AddNewArticle"));
const Technologies = lazy(() => import("../../pages/Technologies"));
const Status = lazy(() => import("../../pages/Status"));
const CourseLevel = lazy(() => import("../../pages/CourseLevel"));
const Building = lazy(() => import("../../pages/Building"));
const ClassRoom = lazy(() => import("../../pages/ClassRoom"));
const Departments = lazy(() => import("../../pages/Department"));
const Terms = lazy(() => import("../../pages/Terms"));
const CourseAssistance = lazy(() => import("../../pages/CourseAssistance"));
const AssistanceWork = lazy(() => import("../../pages/AssistanceWork"));
const TeacherCourses = lazy(() => import("../../pages/TeacherCourses"));

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/sample",
    element: <Sample />,
  },
  {
    path: "/second-page",
    element: <SecondPage />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/courses/view/:courseId",
    element: <CourseDetails />,
  },
  {
    path: "/teacher-courses",
    element: <TeacherCourses />,
  },
  {
    path: "/reserve-list",
    element: <CoursesReserveList />,
  },
  {
    path: "/add-course",
    element: <AddNewCourse />,
  },
  {
    path: "/techs",
    element: <Technologies />,
  },
  {
    path: "/status",
    element: <Status />,
  },
  {
    path: "/courseLevel",
    element: <CourseLevel />,
  },
  {
    path: "/building",
    element: <Building />,
  },
  {
    path: "/classRooms",
    element: <ClassRoom />,
  },
  {
    path: "/departments",
    element: <Departments />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/courseAssistance",
    element: <CourseAssistance />,
  },
  {
    path: "/assistanceWork",
    element: <AssistanceWork />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/view/:userId",
    element: <UserDetails />,
  },
  {
    path: "/comments",
    element: <Comments />,
  },
  {
    path: "/articles",
    element: <Articles />,
  },
  {
    path: "/articles/view/:articleId",
    element: <ArticleDetails />,
  },
  {
    path: "/articleCategoryList",
    element: <ArticleCategoryList />,
  },
  {
    path: "/add-news",
    element: <AddNewArticle />,
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "*",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
