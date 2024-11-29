import instance from "../middleware";

export const getCourseByIdAdmin = (courseId) =>
  instance.get(`/Course/${courseId}`);

export const getCourseByIdUser = (courseId) =>
  instance.get(`/Home/GetCourseDetails?CourseId=${courseId}`);

export const getAllCoursesList = (currentPage, searchTerm) =>
  instance.get(
    `/Course/CourseList?PageNumber=${currentPage}&RowsOfPage=10&SortingCol=DESC&SortType=Expire&${
      searchTerm ? `Query=${searchTerm}` : ""
    }`
  );

export const getCoursesStatistics = () =>
  instance.get("/Course/CourseList?PageNumber=1&RowsOfPage=1000");

export const activateOrDeactiveCourse = (obj) =>
  instance.put("/Course/ActiveAndDeactiveCourse", obj);

export const deleteCourse = (obj) =>
  instance.delete("/Course/DeleteCourse", { data: obj });

export const getCourseCommnets = (id) =>
  instance.get(`/Course/GetCourseCommnets/${id}`);

export const getCourseGroups = (TeacherId, CourseId) =>
  instance.get(
    `/CourseGroup/GetCourseGroup?TeacherId=${TeacherId}&CourseId=${CourseId}`
  );

export const createNewCourseGroup = (formData) =>
  instance.post("/CourseGroup", formData);

export const editCourseGroup = (formData) =>
  instance.put("/CourseGroup", formData);

export const deleteCourseGroup = (id) => {
  const formData = new FormData();
  formData.append("Id", id);
  return instance.delete("/CourseGroup", {
    data: formData,
  });
};

export const getCourseReserveList = (id) =>
  instance.get(`/CourseReserve/${id}`);

export const submitCourseReserve = (obj) =>
  instance.post("/CourseReserve/SendReserveToCourse", obj);

export const deleteCourseReserve = (id) =>
  instance.delete("/CourseReserve", { data: { id } });

export const addCourse = (formData) => instance.post("/Course", formData);

export const editCourse = (formData) => instance.put("/Course", formData);

export const getCreateCourse = () => instance.get("/Course/GetCreate");

export const getAllCoursesReserveList = () => instance.get("/CourseReserve");
