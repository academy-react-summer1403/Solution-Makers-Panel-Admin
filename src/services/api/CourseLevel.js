import instance from "../middleware";

export const getAllCourseLevels = () =>
  instance.get("/CourseLevel/GetAllCourseLevel");

export const getCourseLevelById = (id) => instance.get(`/CourseLevel/${id}`);

export const createCourseLevel = (obj) => instance.post("/CourseLevel", obj);

export const editCourseLevel = (obj) => instance.put("/CourseLevel", obj);
