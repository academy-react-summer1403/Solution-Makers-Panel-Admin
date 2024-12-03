import instance from "../middleware";

export const getAllDepartments = () => instance.get("/Department");

export const getDepartmentById = (id) => instance.get(`/Department/${id}`);

export const createDepartment = (obj) => instance.post("/Department", obj);

export const updateDepartment = (obj) => instance.put("/Department", obj);
