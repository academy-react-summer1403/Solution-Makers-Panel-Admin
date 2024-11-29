import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import {
  selectThemeColors,
  showApplyChangesSwal,
} from "../../../utility/Utils";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { Check, MessageCircle, MoreHorizontal, Trash, X } from "react-feather";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import UserCommentsCustomHeader from "./CustomHeader";
import {
  acceptComment,
  deleteCourseComment,
  getAllComments,
  rejectComment,
  replyToCourseComment,
} from "../../../services/api/Comments";
import { getAllTeachers } from "../../../services/api/Teachers";

const schema = yup
  .object({
    title: yup
      .string()
      .required("عنوان پاسخ را وارد کنید")
      .min(2, "حداقل 2 حرف")
      .max(20, "حداکثر 20 حرف"),
    body: yup
      .string()
      .required("متن پاسخ را وارد کنید")
      .min(10, "حداقل 10 حرف"),
  })
  .required();

function UserComments() {
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const [centeredModal, setCenteredModal] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState({
    value: undefined,
    label: "انتخاب کنید",
  });
  const [teacher, setTeacher] = useState({
    value: "",
    label: "انتخاب کنید",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userComments"],
    queryFn: () =>
      getAllComments(currentPage, searchTerm, currentStatus, teacher, userId),
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: getAllTeachers,
  });

  const { mutateAsync: acceptCommentMutate } = useMutation({
    mutationFn: acceptComment,
    onSuccess: () => {
      queryClient
        .invalidateQueries("userComments")
        .then(() => toast.success("کامنت تایید شد"));
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: rejectCommentMutate } = useMutation({
    mutationFn: rejectComment,
    onSuccess: () => {
      queryClient
        .invalidateQueries("userComments")
        .then(() => toast.success("کامنت رد شد"));
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: deleteCourseCommentMutate } = useMutation({
    mutationFn: deleteCourseComment,
    onSuccess: () => {
      queryClient
        .invalidateQueries("userComments")
        .then(() => toast.success("کامنت حذف شد"));
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: replyToCourseCommentMutate } = useMutation({
    mutationFn: replyToCourseComment,
    onSuccess: () => toast.success("پاسخ ارسال شد"),
    onError: () => toast.error("خطایی رخ داد"),
  });

  useEffect(() => {
    refetch();
  }, [currentStatus, teacher, currentPage]);

  const columns = [
    {
      name: "عنوان دوره",
      selector: (row) => row.courseTitle,
    },
    {
      name: "عنوان کامنت",
      selector: (row) => row.commentTitle,
    },
    {
      name: "متن کامنت",
      selector: (row) => row.describe,
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
              {row.accept && (
                <DropdownItem
                  tag="span"
                  className="w-100"
                  onClick={() => {
                    setCommentId(row.commentId);
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
                    showApplyChangesSwal(() =>
                      rejectCommentMutate(row.commentId)
                    );
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
                    showApplyChangesSwal(() =>
                      acceptCommentMutate(row.commentId)
                    );
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
                  showApplyChangesSwal(() =>
                    deleteCourseCommentMutate(row.commentId)
                  );
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

  const CustomPagination = () => {
    const count = Number(Math.ceil(data?.data.totalCount / 5));
    return (
      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          pageCount={count || 1}
          activeClassName="active"
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={(page) => setCurrentPage(page.selected + 1)}
          pageClassName={"page-item"}
          nextLinkClassName={"page-link"}
          nextClassName={"page-item next"}
          previousClassName={"page-item prev"}
          previousLinkClassName={"page-link"}
          pageLinkClassName={"page-link"}
          containerClassName={
            "pagination react-paginate justify-content-end my-2 pe-1"
          }
        />
      </div>
    );
  };

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">فیلترها</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="6">
              <Label for="role-select">استاد</Label>
              <Select
                isClearable={false}
                value={teacher}
                options={teachers?.data.map((teacher) => ({
                  value: teacher.teacherId,
                  label: teacher.fullName,
                }))}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentPage(1);
                  setTeacher(data);
                }}
              />
            </Col>
            <Col md="6">
              <Label for="status-select">وضعیت</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={[
                  { value: true, label: "تایید شده" },
                  { value: false, label: "تایید نشده" },
                ]}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentPage(1);
                  setCurrentStatus(data);
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            pagination
            responsive
            paginationServer
            columns={columns}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={data?.data.comments}
            subHeaderComponent={
              <UserCommentsCustomHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                refetch={refetch}
              />
            }
          />
        </div>
      </Card>

      <div className="vertically-centered-modal">
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
                const formData = new FormData();
                formData.append("CommentId", commentId);
                formData.append("CourseId", courseId);
                formData.append("Title", data.title);
                formData.append("Describe", data.body);
                replyToCourseCommentMutate(formData).then(() => {
                  reset();
                  setCenteredModal(!centeredModal);
                });
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
                  ارسال
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
}

export default UserComments;
