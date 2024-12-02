import instance from "../middleware";

export const getArticleById = (id) => instance.get(`/News/${id}`);

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

export const getAdminArticleComments = (articleId) =>
  instance.get(`/News/GetAdminNewsComments?NewsId=${articleId}`);

export const getAdminArticleCommentReplies = (commentId) =>
  instance.get(`/News/GetAdminRepliesComments?CommentId=${commentId}`);

export const editArticleComment = (obj) =>
  instance.put("/News/UpdateNewsComment", obj);

export const addarticleCommentReply = (obj) =>
  instance.post("/News/CreateNewsReplyComment", obj);

export const activeOrDeactiveNews = (formData) =>
  instance.put("/News/ActiveDeactiveNews", formData);

export const createNewArticle = (formData) =>
  instance.post("/News/CreateNews", formData);

export const editArticle = (formData) =>
  instance.put("/News/UpdateNews", formData);

export const getCategoryWithId = (id) =>
  instance.get(`/News/GetNewsCategory/${id}`);

export const getNewsCategoriesList = () =>
  instance.get("/News/GetListNewsCategory");

export const getNewsWithCategoryId = (categoryId) =>
  instance.get(`/News/GetNewsWithCategory/${categoryId}`);

export const createNewCategory = (formData) =>
  instance.post("/News/CreateNewsCategory", formData);

export const editCategory = (formData) =>
  instance.put("/News/UpdateNewsCategory", formData);
