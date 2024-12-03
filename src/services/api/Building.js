import instance from "../middleware";

export const getAllBuildings = () => instance.get("/Building");

export const getBuildingById = (id) => instance.get(`/Building/${id}`);

export const addBuilding = (obj) => instance.post("/Building", obj);

export const updateBuilding = (obj) => instance.put("/Building", obj);

export const activeOrDeactiveBuilding = (obj) =>
  instance.put("/Building/Active", obj);
