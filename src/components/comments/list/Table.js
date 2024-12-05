import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { Eye } from "react-feather";
import Select from "react-select";
import { selectThemeColors } from "../../../utility/Utils";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import AllCommentsCustomHeader from "./CustomHeader";
import {
  acceptComment,
  deleteCourseComment,
  getAllComments,
  getCourseCommnetReplies,
  rejectComment,
  replyToCourseComment,
} from "../../../services/api/Comments";
import toast from "react-hot-toast";
import { getAllTeachers } from "../../../services/api/Teachers";
import { actions, isAccept } from "./actions";
import ReplyModal from "../../modals/ReplyModal";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import ErrorComponent from "../../common/ErrorComponent";

function CommentsListTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [commentId, setCommentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [allReplies, setAllReplies] = useState([]);
  const [repliesModal, setRepliesModal] = useState(false);
  const [centeredModal, setCenteredModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState({
    value: undefined,
    label: "انتخاب کنید",
  });
  const [teacher, setTeacher] = useState({
    value: "",
    label: "انتخاب کنید",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      getAllComments(currentPage, searchTerm, currentStatus, teacher),
  });

  const { data: teachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: getAllTeachers,
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
      queryClient
        .invalidateQueries("comments")
        .then(() => toast.success("کامنت تایید شد"));
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: rejectCommentMutate } = useMutation({
    mutationFn: rejectComment,
    onSuccess: () => {
      queryClient
        .invalidateQueries("comments")
        .then(() => toast.success("کامنت رد شد"));
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: deleteCourseCommentMutate } = useMutation({
    mutationFn: deleteCourseComment,
    onSuccess: () => {
      queryClient
        .invalidateQueries("comments")
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

  useEffect(() => {
    if (courseId && commentId && !centeredModal) {
      repliesRefetch();
    }
  }, [courseId, commentId]);

  useEffect(() => {
    if (replies?.data) {
      replies?.data.map((reply) => {
        setCommentId(reply.id);
        setCourseId(reply.courseId);
        allReplies.push(reply);
      });
    }
  }, [replies?.data]);

  useEffect(() => {
    if (!repliesModal) {
      setAllReplies([]);
    }
  }, [repliesModal]);

  useEffect(() => {
    if (!centeredModal && !repliesModal) {
      setAllReplies([]);
    }
  }, [centeredModal]);

  const columns = [
    {
      name: "کاربر",
      center: true,
      selector: (row) => row.userFullName,
    },
    {
      name: "عنوان کامنت",
      center: true,
      selector: (row) => row.commentTitle,
    },
    {
      name: "متن کامنت",
      center: true,
      selector: (row) => row.describe,
    },
    {
      name: "وضعیت",
      center: true,
      cell: (row) => isAccept(row),
    },
    {
      name: "پاسخ ها",
      center: true,
      cell: (row) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCommentId(row.commentId);
              setCourseId(row.courseId);
              setRepliesModal(true);
            }}
          >
            <Eye />
          </span>
        );
      },
    },
    {
      name: "عملیات",
      center: true,
      cell: (row) =>
        actions(
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
        ),
    },
  ];

  const repliesColumns = [
    {
      name: "کاربر",
      center: true,
      selector: (row) => row.author,
    },
    {
      name: "عنوان",
      center: true,
      selector: (row) => row.title,
    },
    {
      name: "متن کامنت",
      center: true,
      selector: (row) => row.describe,
    },
    {
      name: "وضعیت",
      center: true,
      cell: (row) => isAccept(row),
    },
    {
      name: "عملیات",
      center: true,
      cell: (row) =>
        actions(
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
        ),
    },
  ];

  const CustomPagination = () => {
    const count = Number(Math.ceil(data?.data.totalCount / 10));
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

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">فیلترها</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
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
            <Col md="4">
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
              <AllCommentsCustomHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                refetch={refetch}
              />
            }
          />
        </div>
      </Card>

      <Modal
        isOpen={repliesModal}
        toggle={() => setRepliesModal(!repliesModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setRepliesModal(!repliesModal)}>
          <span style={{ fontSize: 20 }}>پاسخ ها</span>
        </ModalHeader>
        <ModalBody id="replyModal">
          {repliesError ? (
            <ErrorComponent />
          ) : (
            <DataTable
              noHeader
              responsive
              columns={repliesColumns}
              data={allReplies}
              className="react-dataTable"
            />
          )}
        </ModalBody>
      </Modal>

      <ReplyModal
        centeredModal={centeredModal}
        setCenteredModal={setCenteredModal}
        replyToCourseCommentMutate={replyToCourseCommentMutate}
      />
    </>
  );
}

export default CommentsListTable;
