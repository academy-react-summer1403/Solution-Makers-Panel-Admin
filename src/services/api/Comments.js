import instance from "../middleware";

export const getAllComments = (
  currentPage,
  searchTerm,
  currentStatus,
  teacher,
  userId
) =>
  instance.get(
    `/Course/CommentManagment?PageNumber=${currentPage}&RowsOfPage=10&SortingCol=DESC&SortType=InsertDate${
      searchTerm ? `&Query=${searchTerm}` : ""
    }${
      currentStatus.value != undefined ? `&Accept=${currentStatus.value}` : ""
    }${teacher.value ? `&TeacherId=${teacher.value}` : ""}${
      userId ? `&userId=${userId}` : ""
    }`
  );

export const getCourseCommnetReplies = (courseId, commentId) =>
  instance.get(`/Course/GetCourseReplyCommnets/${courseId}/${commentId}`);

export const acceptComment = (id) =>
  instance.post(`/Course/AcceptCourseComment?CommentCourseId=${id}`);

export const rejectComment = (id) =>
  instance.post(`/Course/RejectCourseComment?CommentCourseId=${id}`);

export const deleteCourseComment = (id) =>
  instance.delete(`/Course/DeleteCourseComment?CourseCommandId=${id}`);

export const editCourseComment = (formData) =>
  instance.put("/Course/UpdateCourseComment", formData);

export const replyToCourseComment = (formData) =>
  instance.post("/Course/AddReplyCourseComment", formData);
