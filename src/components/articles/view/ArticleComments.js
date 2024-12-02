import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  addarticleCommentReply,
  editArticleComment,
  getAdminArticleCommentReplies,
  getAdminArticleComments,
} from "../../../services/api/Articles";
import {
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import DataTable from "react-data-table-component";
import ErrorComponent from "../../common/ErrorComponent";
import { Edit2, FileText, MessageCircle, MoreHorizontal } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { getItem } from "../../../services/common/storage";
import toast from "react-hot-toast";

const schema = yup
  .object({
    title: yup
      .string()
      .required("عنوان پاسخ را وارد کنید")
      .min(5, "حداقل 5 حرف")
      .max(40, "حداکثر 40 حرف"),
    describe: yup
      .string()
      .required("متن پاسخ را وارد کنید")
      .min(10, "حداقل 10 حرف"),
  })
  .required();

function ArticleComments() {
  const { articleId } = useParams();
  const queryClient = useQueryClient();
  const [centeredModal, setCenteredModal] = useState(false);
  const [repliesModal, setRepliesModal] = useState(false);
  const [editCommentModal, setEditCommentModal] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [commentData, setCommentData] = useState({});
  const [allReplies, setAllReplies] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      describe: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articleComments"],
    queryFn: () => getAdminArticleComments(articleId),
  });

  const {
    data: replies,
    isLoading: repliesLoading,
    error: repliesError,
    refetch: repliesRefetch,
  } = useQuery({
    queryKey: ["articleCommentReplies"],
    queryFn: () => getAdminArticleCommentReplies(commentId),
    enabled: false,
  });

  const { mutateAsync: addarticleCommentReplyMutate } = useMutation({
    mutationFn: addarticleCommentReply,
    onSuccess: () => {
      toast.success("پاسخ ارسال شد");
      reset();
      setCenteredModal(!centeredModal);
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: editArticleCommentMutate } = useMutation({
    mutationFn: editArticleComment,
    onSuccess: () => {
      queryClient.invalidateQueries("articleComments");
      toast.success("تغییرات ثبت شد");
      setEditCommentModal(!editCommentModal);
      if (repliesModal) {
        setRepliesModal(!repliesModal);
      }
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  useEffect(() => {
    if (replies?.data) {
      replies?.data.map((reply) => {
        setCommentId(reply.id);
        allReplies.push(reply);
      });
    }
  }, [replies?.data]);

  useEffect(() => {
    if (commentId) {
      repliesRefetch();
    }
  }, [commentId]);

  useEffect(() => {
    if (!repliesModal) {
      setAllReplies([]);
    }
  }, [repliesModal]);

  useEffect(() => {
    if (!editCommentModal) {
      reset();
    }
  }, [editCommentModal]);

  const columns = [
    {
      name: "کاربر",
      center: true,
      selector: (row) => row.autor,
    },
    {
      name: "عنوان کامنت",
      center: true,
      selector: (row) => row.title,
    },
    {
      name: "متن کامنت",
      center: true,
      selector: (row) => row.describe,
    },
    {
      name: "عملیات",
      center: true,
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreHorizontal size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu
              className="mb-4"
              container={repliesModal ? "repliesModalBody" : "body"}
            >
              {repliesModal ? null : (
                <DropdownItem
                  tag="span"
                  className="w-100"
                  onClick={() => {
                    setCommentId(row.id);
                    setRepliesModal(!repliesModal);
                  }}
                >
                  <FileText size={14} className="me-50" />
                  <span className="align-middle">نمایش پاسخ ها</span>
                </DropdownItem>
              )}
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  setCenteredModal(!centeredModal);
                  setCommentData(row);
                }}
              >
                <MessageCircle size={14} className="me-50" />
                <span className="align-middle">پاسخ دادن</span>
              </DropdownItem>
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  setEditCommentModal(!editCommentModal);
                  setCommentData(row);
                  setValue("title", row.title);
                  setValue("describe", row.describe);
                }}
              >
                <Edit2 size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <Card>
        <div className="react-dataTable user-view-account-projects">
          <DataTable
            noHeader
            responsive
            columns={columns}
            data={comments.data}
            className="react-dataTable"
          />
        </div>
      </Card>

      <Modal
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
          پاسخ خود را بنویسید
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data, event) => {
              event.preventDefault();
              const obj = {
                newsId: articleId,
                userIpAddress: "testIpAddress",
                title: data.title,
                describe: data.describe,
                userId: getItem("userId"),
                parentId: commentData.id,
              };
              addarticleCommentReplyMutate(obj);
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
                name="describe"
                control={control}
                render={({ field }) => (
                  <Input type="textarea" {...field} placeholder="متن پاسخ" />
                )}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.describe?.message}
              </p>
            </div>
            <div className="d-flex justify-content-end">
              <Button type="submit" color="primary">
                ارسال
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={repliesModal}
        toggle={() => setRepliesModal(!repliesModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setRepliesModal(!repliesModal)}>
          پاسخ ها
        </ModalHeader>
        <ModalBody id="repliesModalBody">
          {repliesLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner color="primary" />
            </div>
          ) : (
            <>
              {repliesError ? (
                <ErrorComponent />
              ) : (
                <div className="react-dataTable user-view-account-projects">
                  <DataTable
                    noHeader
                    responsive
                    columns={columns}
                    data={allReplies}
                    className="react-dataTable"
                  />
                </div>
              )}
            </>
          )}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={editCommentModal}
        toggle={() => setEditCommentModal(!editCommentModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setEditCommentModal(!editCommentModal)}>
          ویرایش کامنت
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data, event) => {
              event.preventDefault();
              const obj = {
                id: commentData.id,
                newsId: articleId,
                title: data.title,
                describe: data.describe,
                accept: event.target.ex1.value == "true" ? true : false,
              };
              editArticleCommentMutate(obj);
              console.log(obj);
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
                name="describe"
                control={control}
                render={({ field }) => (
                  <Input type="textarea" {...field} placeholder="متن پاسخ" />
                )}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.describe?.message}
              </p>
            </div>

            <div className="demo-inline-spacing">
              <div className="form-check">
                <Input
                  type="radio"
                  id="ex1-active"
                  name="ex1"
                  value={true}
                  defaultChecked
                />
                <Label className="form-check-label" for="ex1-active">
                  تایید کامنت
                </Label>
              </div>
              <div className="form-check">
                <Input
                  type="radio"
                  id="ex1-inactive"
                  name="ex1"
                  value={false}
                />
                <Label className="form-check-label" for="ex1-inactive">
                  رد کامنت
                </Label>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Button type="submit" color="primary">
                ثبت
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default ArticleComments;
