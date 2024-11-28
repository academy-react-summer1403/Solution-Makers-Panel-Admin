import instance from "../middleware";

export const getAllTeachers = () => instance.get("/Home/GetTeachers");
