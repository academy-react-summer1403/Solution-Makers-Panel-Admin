import instance from "../middleware";

export const getDashboardReport = () => instance.get("/Report/DashboardReport");

export const getTechnologyUsedInCourses = () => instance.get("/Report/DashboardTechnologyReport");