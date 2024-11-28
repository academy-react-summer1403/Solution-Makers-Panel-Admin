import { Check, MessageCircle, MoreHorizontal, Trash, X } from "react-feather";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { showApplyChangesSwal } from "../../../utility/Utils";

export const actions = (
  row,
  setCommentId,
  setCourseId,
  setCenteredModal,
  centeredModal,
  rejectCommentMutate,
  setRepliesModal,
  repliesModal,
  acceptCommentMutate,
  deleteCourseCommentMutate
) => {
  return (
    <div
      id={row.parentId ? "replyRow" : "commentRow"}
      className="column-action"
    >
      <UncontrolledDropdown>
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreHorizontal size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu
          className="mb-4"
          container={row.parentId ? "replyModal" : "body"}
        >
          {row.accept && (
            <DropdownItem
              tag="span"
              className="w-100"
              onClick={() => {
                if (row.commentId) {
                  setCommentId(row.commentId);
                } else {
                  setCommentId(row.id);
                }
                setCourseId(row.courseId);
                setCenteredModal(!centeredModal);
              }}
            >
              <MessageCircle size={14} className="me-50" />
              <span className="align-middle">پاسخ</span>
            </DropdownItem>
          )}
          {row.accept ? (
            <DropdownItem
              tag="span"
              className="w-100"
              onClick={() => {
                if (row.commentId) {
                  showApplyChangesSwal(() =>
                    rejectCommentMutate(row.commentId)
                  );
                } else {
                  showApplyChangesSwal(() =>
                    rejectCommentMutate(row.id).then(() =>
                      setRepliesModal(!repliesModal)
                    )
                  );
                }
              }}
            >
              <X size={14} className="me-50" />
              <span className="align-middle">عدم تایید</span>
            </DropdownItem>
          ) : (
            <DropdownItem
              tag="span"
              className="w-100"
              onClick={() => {
                if (row.commentId) {
                  showApplyChangesSwal(() =>
                    acceptCommentMutate(row.commentId)
                  );
                } else {
                  showApplyChangesSwal(() =>
                    acceptCommentMutate(row.id).then(() =>
                      setRepliesModal(!repliesModal)
                    )
                  );
                }
              }}
            >
              <Check size={14} className="me-50" />
              <span className="align-middle">تایید</span>
            </DropdownItem>
          )}
          <DropdownItem
            tag="span"
            className="w-100"
            onClick={() => {
              if (row.commentId) {
                showApplyChangesSwal(() =>
                  deleteCourseCommentMutate(row.commentId)
                );
              } else {
                showApplyChangesSwal(() =>
                  deleteCourseCommentMutate(row.id).then(() =>
                    setRepliesModal(!repliesModal)
                  )
                );
              }
            }}
          >
            <Trash size={14} className="me-50" />
            <span className="align-middle">حذف</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export const isAccept = (row) => {
  if (row.accept) {
    return (
      <span
        className="rounded-1"
        style={{
          padding: 4,
          backgroundColor: "#cafade",
          color: "#28c76f",
        }}
      >
        تایید شده
      </span>
    );
  } else {
    return (
      <span
        className="rounded-1"
        style={{
          padding: 4,
          backgroundColor: "#ffdbdb",
          color: "#ff0000",
        }}
      >
        تایید نشده
      </span>
    );
  }
};
