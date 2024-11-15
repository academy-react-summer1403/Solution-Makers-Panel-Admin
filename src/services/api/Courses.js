import instance from "../middleware";

export const getCourseByIdAdmin = (courseId) => instance.get(`/Course/${courseId}`);

