import instance from "../middleware";

export const getAdminNewsList = (
  currentPage,
  sortingCol,
  searchTerm,
  IsActive
) =>
  instance.get(
    `/News/AdminNewsFilterList?PageNumber=${currentPage}&RowsOfPage=10${
      sortingCol ? `&SortingCol=${sortingCol}` : ""
    }&SortType=DESC${searchTerm ? `&Query=${searchTerm}` : ""}${
      IsActive ? `&IsActive=${IsActive}` : ""
    }`
  );

export const activeOrDeactiveNews = (formData) =>
  instance.put("/News/ActiveDeactiveNews", formData);
