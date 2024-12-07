import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FileText, MoreHorizontal, Edit2, Trash } from "react-feather";
import {
  Card,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Input,
} from "reactstrap";
import { isObjEmpty, showApplyChangesSwal } from "../../../utility/Utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getCourseCommnets } from "../../../services/api/Courses";
import {
  acceptComment,
  deleteCourseComment,
  editCourseComment,
  getCourseCommnetReplies,
  rejectComment,
  replyToCourseComment,
} from "../../../services/api/Comments";
import SearchComponent from "../../common/SearchComponent";
import ErrorComponent from "../../common/ErrorComponent";

const schema = yup
  .object({
    title: yup
      .string()
      .required("عنوان پاسخ را وارد کنید")
      .min(5, "حداقل 5 حرف")
      .max(40, "حداکثر 40 حرف"),
    body: yup
      .string()
      .required("متن پاسخ را وارد کنید")
      .min(10, "حداقل 10 حرف"),
  })
  .required();

const CourseComments = () => {
  const { courseId } = useParams();
  const [commentId, setCommentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [basicModal, setBasicModal] = useState(false);
  const [centeredModal, setCenteredModal] = useState(false);
  const [repliesModal, setRepliesModal] = useState(false);
  const [commentData, setCommentData] = useState({});
  const [replyData, setReplyData] = useState({});
  const [allReplies, setAllReplies] = useState([]);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      body: "",
      commentId: "",
    },
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseComments"],
    queryFn: () => getCourseCommnets(courseId),
  });

  const {
    data: replies,
    isLoading: repliesIsLoading,
    error: repliesError,
    refetch: repliesRefetch,
  } = useQuery({
    queryKey: ["courseDetailsCommentReplies"],
    queryFn: () => getCourseCommnetReplies(courseId, commentId),
    enabled: false,
  });

  const { mutateAsync: acceptCommentMutate } = useMutation({
    mutationFn: acceptComment,
    onSuccess: () => {
      if (repliesModal) {
        repliesRefetch().then(() => toast.success("کامنت تایید شد"));
      } else {
        refetch().then(() => toast.success("کامنت تایید شد"));
      }
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: rejectCommentMutate } = useMutation({
    mutationFn: rejectComment,
    onSuccess: () => {
      if (repliesModal) {
        repliesRefetch().then(() => toast.success("کامنت رد شد"));
      } else {
        refetch().then(() => toast.success("کامنت رد شد"));
      }
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: replyToCourseCommentMutate } = useMutation({
    mutationFn: replyToCourseComment,
    onSuccess: () => toast.success("پاسخ ارسال شد"),
    onError: () => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: editCourseCommentMutate } = useMutation({
    mutationFn: editCourseComment,
    onSuccess: () => {
      if (repliesModal) {
        repliesRefetch().then(() => toast.success("کامنت ویرایش شد"));
      } else {
        refetch().then(() => toast.success("کامنت ویرایش شد"));
      }
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: deleteCourseCommentMutate } = useMutation({
    mutationFn: deleteCourseComment,
    onSuccess: () => {
      if (repliesModal) {
        repliesRefetch().then(() => toast.success("کامنت حذف شد"));
      } else {
        refetch().then(() => toast.success("کامنت حذف شد"));
      }
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const columns = [
    { name: "نام کاربر", selector: (row) => row.author },
    {
      minWidth: `${repliesModal ? "" : "300px"}`,
      name: "عنوان کامنت",
      cell: (row) => <p>{row.title}</p>,
    },
    {
      name: "وضعیت",
      cell: (row) => {
        if (row.accept) {
          return (
            <span
              className="rounded-1"
              style={{
                cursor: "pointer",
                padding: 4,
                backgroundColor: "#cafade",
                color: "#28c76f",
              }}
              onClick={() => {
                showApplyChangesSwal(() => rejectCommentMutate(row.id));
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
                cursor: "pointer",
                padding: 4,
                backgroundColor: "#ffdbdb",
                color: "#ff0000",
              }}
              onClick={() => {
                showApplyChangesSwal(() => acceptCommentMutate(row.id));
              }}
            >
              تایید نشده
            </span>
          );
        }
      },
    },
    {
      name: "عملیات",
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreHorizontal size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu className="mb-4" container="body">
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  setCommentData(row);
                  setCommentId(row.id);
                  setBasicModal(!basicModal);
                }}
              >
                <FileText size={14} className="me-50" />
                <span className="align-middle">نمایش جزئیات</span>
              </DropdownItem>
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  reset();
                  setValue("title", row.title);
                  setValue("body", row.describe);
                  setValue("commentId", row.id);
                  setCenteredModal(!centeredModal);
                }}
              >
                <Edit2 size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  showApplyChangesSwal(() => deleteCourseCommentMutate(row.id));
                }}
              >
                <Trash size={14} className="me-50" />
                <span className="align-middle">حذف</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  const repliesColumns = [
    ...columns.slice(0, -1),
    {
      name: "ویرایش",
      cell: (row) => (
        <Edit2
          style={{ cursor: "pointer" }}
          onClick={() => {
            reset();
            setValue("title", row.title);
            setValue("body", row.describe);
            setValue("commentId", row.id);
            setCenteredModal(!centeredModal);
          }}
        />
      ),
    },
    {
      name: "حذف",
      cell: (row) => (
        <Trash
          style={{ cursor: "pointer" }}
          onClick={() => {
            showApplyChangesSwal(() => deleteCourseCommentMutate(row.id));
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (replies?.data) {
      replies?.data.map((reply) => {
        setCommentId(reply.id);
        setReplyData(reply);
        allReplies.push(reply);
      });
    }
  }, [replies?.data]);

  useEffect(() => {
    if (!isObjEmpty(replyData)) {
      repliesRefetch();
    }
  }, [replyData, commentId]);

  useEffect(() => {
    if (!basicModal) {
      setAllReplies([]);
    }
  }, [basicModal]);

  if (isLoading) {
    return <span>loading data ...</span>;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <SearchComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        width="40"
      />
      <Card>
        <div className="react-dataTable user-view-account-projects">
          <DataTable
            noHeader
            responsive
            columns={columns}
            data={data.data
              .filter((item) => {
                if (!searchTerm) {
                  return item;
                } else {
                  const pattern = new RegExp(`${searchTerm}`, "i");
                  return pattern.test(item.title) || pattern.test(item.author);
                }
              })
              .sort(
                (a, b) =>
                  new Date(b.insertDate).getTime() -
                  new Date(a.insertDate).getTime()
              )}
            className="react-dataTable"
          />
        </div>
      </Card>
      <div className="basic-modal">
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>
            <div className="d-flex flex-column fs-3">
              <span>نویسنده : {commentData.author}</span>
              <span> عنوان : {commentData.title}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="d-flex flex-column fs-3">
              <p>متن کامنت : {commentData.describe}</p>
              <span>تعداد لایک ها : {commentData.likeCount}</span>
              <span>
                تاریخ ثبت :{" "}
                {commentData.insertDate && commentData.insertDate.slice(0, 10)}
              </span>
            </div>
          </ModalBody>
          <ModalFooter>
            {commentData.accept ? (
              <Button
                color="primary"
                onClick={() => {
                  rejectCommentMutate(commentData.id).then(() =>
                    setCommentData({ ...commentData, accept: false })
                  );
                }}
              >
                رد کردن
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={() => {
                  acceptCommentMutate(commentData.id).then(() =>
                    setCommentData({ ...commentData, accept: true })
                  );
                }}
              >
                تایید کردن
              </Button>
            )}
            {commentData.accept && (
              <Button
                color="primary"
                onClick={() => {
                  reset();
                  setCenteredModal(!centeredModal);
                }}
              >
                پاسخ دادن
              </Button>
            )}
            <Button
              color="primary"
              onClick={() => {
                repliesRefetch().then(() => setRepliesModal(!repliesModal));
              }}
            >
              نمایش پاسخ ها
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <Modal
          isOpen={repliesModal}
          toggle={() => setRepliesModal(!repliesModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setRepliesModal(!repliesModal)}>
            <span style={{ fontSize: 20 }}>پاسخ ها</span>
          </ModalHeader>
          <ModalBody>
            <DataTable
              noHeader
              responsive
              columns={repliesColumns}
              data={allReplies}
              className="react-dataTable"
            />
          </ModalBody>
        </Modal>
      </div>
      <div className="vertically-centered-modal">
        <Modal
          isOpen={centeredModal}
          toggle={() => setCenteredModal(!centeredModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
            {getValues("commentId") ? "ویرایش کامنت" : "پاسخ خود را بنویسید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const formData = new FormData();
                if (getValues("commentId")) {
                  formData.append("CommentId", getValues("commentId"));
                  formData.append("CourseId", courseId);
                  formData.append("Title", data.title);
                  formData.append("Describe", data.body);
                  editCourseCommentMutate(formData).then(() => {
                    reset();
                    setCenteredModal(!centeredModal);
                  });
                } else {
                  formData.append("CommentId", commentData.id);
                  formData.append("CourseId", courseId);
                  formData.append("Title", data.title);
                  formData.append("Describe", data.body);
                  replyToCourseCommentMutate(formData).then(() => {
                    reset();
                    setCenteredModal(!centeredModal);
                  });
                }
              })}
            >
              <div className="mb-2">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="عنوان پاسخ" />
                  )}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.title?.message}
                </p>
              </div>
              <div className="mb-2">
                <Controller
                  name="body"
                  control={control}
                  render={({ field }) => (
                    <Input type="textarea" {...field} placeholder="متن پاسخ" />
                  )}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.body?.message}
                </p>
              </div>
              <div className="text-end">
                <Button color="primary" type="submit">
                  {getValues("commentId") ? "ثبت" : "ارسال"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default CourseComments;
