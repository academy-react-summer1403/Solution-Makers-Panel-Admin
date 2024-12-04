import instance from "../middleware";

export const getAllAssistance = () => instance.get("/CourseAssistance");

export const getAssistanceById = (id) =>
  instance.get(`/CourseAssistance/${id}`);

export const addAssistanceForCourse = (obj) =>
  instance.post("/CourseAssistance", obj);

export const updateAssistance = (obj) => instance.put("/CourseAssistance", obj);
