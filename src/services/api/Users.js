import toast from "react-hot-toast";
import instance from "../middleware";

export const getUsersList = (
  currentPage,
  searchTerm,
  currentRole,
  currentStatus,
  RowsOfPage
) =>
  instance.get(
    `/User/UserMannage?PageNumber=${currentPage}&RowsOfPage=${RowsOfPage}&SortingCol=DESC&SortType=InsertDate${
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

export const recoverDeletedUser = (obj) =>
  instance.put("/User/ReverseToActiveUser", obj);

export const addUserAccess = (roleId, userId, enable) =>
  instance
    .post(
      "/User/AddUserAccess",
      {
        roleId,
        userId,
      },
      {
        params: {
          Enable: enable,
        },
      }
    )
    .then(() => toast.success("دسترسی با موفقیت تغییر کرد"))
    .catch((err) => toast.error("خطایی رخ داد"));
