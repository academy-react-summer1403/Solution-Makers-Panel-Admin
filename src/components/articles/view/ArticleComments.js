import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  addarticleCommentReply,
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
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import DataTable from "react-data-table-component";
import ErrorComponent from "../../common/ErrorComponent";
import { FileText, MessageCircle, MoreHorizontal } from "react-feather";
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
  const [centeredModal, setCenteredModal] = useState(false);
  const [repliesModal, setRepliesModal] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [commentData, setCommentData] = useState({});
  const [allReplies, setAllReplies] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
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
    </>
  );
}

export default ArticleComments;
