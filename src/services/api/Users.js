import instance from "../middleware";

export const getUsersList = (
  currentPage,
  searchTerm,
  currentRole,
  currentStatus
) =>
  instance.get(
    `/User/UserMannage?PageNumber=${currentPage}&RowsOfPage=10&SortingCol=DESC&SortType=InsertDate${
      searchTerm ? `&Query=${searchTerm}` : ""
    }${currentRole.value ? `&roleId=${currentRole.value}` : ""}${
      currentStatus.value ? `&IsActiveUser=${currentStatus.value}` : ""
    }`
  );

export const getUserById = (userId) =>
  instance.get(`/User/UserDetails/${userId}`);

export const reverseToActiveUser = (userId) =>
  instance.put("/User/ReverseToActiveUser", {
    userId,
  });

export const getUsersStatistics = () =>
  instance.get(`/User/UserMannage?PageNumber=1&RowsOfPage=1000`);

export const createUser = (obj) => instance.post("/User/CreateUser", obj);

export const updateUser = (obj) => instance.put("/User/UpdateUser", obj);

export const deleteUser = (userId) =>
  instance.delete("/User/DeleteUser", {
    data: { userId },
  });
