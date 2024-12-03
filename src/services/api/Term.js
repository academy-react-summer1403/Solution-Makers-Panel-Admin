import instance from "../middleware";

export const getAllterms = () => instance.get("/Term");

export const getTermById = (id) => instance.get(`/Term/${id}`);

export const addTerm = (obj) => instance.post("/Term", obj);

export const updateTerm = (obj) => instance.put("/Term", obj);
