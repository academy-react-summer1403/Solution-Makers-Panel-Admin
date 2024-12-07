import instance from "../middleware";

export const getAllTeachers = () => instance.get("/Home/GetTeachers");

export const getTeacherCourses = (currentPage, searchTerm) =>
  instance.get(
    `/Course/TeacherCourseList?PageNumber=${currentPage}&RowsOfPage=10${
      searchTerm ? `&Query=${searchTerm}` : ""
    }`
  );
