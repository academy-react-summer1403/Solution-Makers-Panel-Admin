import instance from "../middleware";

export const getAllAssistance = () => instance.get("/CourseAssistance");

export const getAssistanceById = (id) =>
  instance.get(`/CourseAssistance/${id}`);

export const addAssistanceForCourse = (obj) =>
  instance.post("/CourseAssistance", obj);

export const updateAssistance = (obj) => instance.put("/CourseAssistance", obj);

export const getAllAssistanceWork = () => instance.get("/AssistanceWork");

export const getAssistanceWorkById = (id) =>
  instance.get(`/AssistanceWork/${id}`);

export const createAssistanceWork = (obj) =>
  instance.post("/AssistanceWork", obj);

export const updateAssistanceWork = (obj) =>
  instance.put("/AssistanceWork", obj);
