import instance from "../middleware";

export const getAllComments = (
  currentPage,
  searchTerm,
  currentStatus,
  teacher
) =>
  instance.get(
    `/Course/CommentManagment?PageNumber=${currentPage}&RowsOfPage=10&SortingCol=DESC&SortType=InsertDate${
      searchTerm ? `&Query=${searchTerm}` : ""
    }${
      currentStatus.value != undefined ? `&Accept=${currentStatus.value}` : ""
    }${teacher.value ? `&TeacherId=${teacher.value}` : ""}`
  );

export const getCourseCommnetReplies = (courseId, commentId) =>
  instance.get(`/Course/GetCourseReplyCommnets/${courseId}/${commentId}`);

export const acceptComment = (id) =>
  instance.post(`/Course/AcceptCourseComment?CommentCourseId=${id}`);

export const rejectComment = (id) =>
  instance.post(`/Course/RejectCourseComment?CommentCourseId=${id}`);

export const deleteCourseComment = (id) =>
  instance.delete(`/Course/DeleteCourseComment?CourseCommandId=${id}`);

export const replyToCourseComment = (formData) =>
  instance.post("/Course/AddReplyCourseComment", formData);
