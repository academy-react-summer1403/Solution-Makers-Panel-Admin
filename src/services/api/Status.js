import instance from "../middleware";

export const getStatusList = () => instance.get("/Status");

export const getStatusById = (id) => instance.get(`/Status/${id}`);

export const createStatus = (obj) => instance.post("/Status", obj);

export const editStatus = (obj) => instance.put("/Status", obj);
