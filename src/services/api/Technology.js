import instance from "../middleware";

export const getTechnologies = () => instance.get("/Technology");

export const getTechnologyById = (id) => instance.get(`/Technology/${id}`);

export const createTechnology = (obj) => instance.post("/Technology", obj);

export const editTechnology = (obj) => instance.put("/Technology", obj);
