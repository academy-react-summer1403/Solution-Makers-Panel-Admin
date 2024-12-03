import instance from "../middleware";

export const getAllClassRooms = () => instance.get("/ClassRoom");

export const getClassRoomById = (id) => instance.get(`/ClassRoom/${id}`);

export const addClassRoom = (obj) => instance.post("/ClassRoom", obj);

export const updateClassRoom = (obj) => instance.put("/ClassRoom", obj);
