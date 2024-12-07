import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import Avatar from "@components/avatar";
import { useNavigate } from "react-router-dom";
import { Check, X } from "react-feather";
import {
  Card,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Button,
} from "reactstrap";
import { Edit2, MoreHorizontal, FileText } from "react-feather";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AllCoursesCustomHeader from "./CustomHeader";
import toast from "react-hot-toast";
import { showApplyChangesSwal } from "../../../utility/Utils";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import {
  activateOrDeactiveCourse,
  deleteCourse,
  getAllCoursesList,
} from "../../../services/api/Courses";
import ErrorComponent from "../../common/ErrorComponent";

const CoursesListTable = ({
  RowsOfPage,
  needAddNewCourse,
  needCourseId,
  setStep,
  setObj,
  editObj,
  setEditObj,
  setEditStep,
  setEditModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: "مرتب سازی",
    number: 0,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getAllCoursesList(currentPage, searchTerm, RowsOfPage),
  });

  const { mutateAsync } = useMutation({
    mutationFn: activateOrDeactiveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries("courses");
    },
    onError: () => {
      toast.error("error");
    },
  });

  const { mutateAsync: deletionMutate } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["courses", "nums"]);
    },
    onError: () => {
      toast.error("error");
    },
  });

  const renderCourse = (row) => {
    if (row.tumbImageAddress) {
      return (
        <Avatar
          className="me-1"
          img={row.tumbImageAddress}
          width="32"
          height="32"
        />
      );
    } else {
      return (
        <Avatar
          initials
          className="me-1"
          img="/src/assets/images/notFound/1047293-صفحه-یافت-نشد-خطای-404.jpg"
        />
      );
    }
  };

  let columns;

  if (needCourseId) {
    columns = [
      {
        name: "نام دوره",
        minWidth: "300px",
        selector: (row) => row.title,
        cell: (row) => (
          <div className="d-flex justify-content-left align-items-center">
            {renderCourse(row)}
            <div className="d-flex">
              <span>{row.title}</span>
            </div>
          </div>
        ),
      },
      {
        name: "وضعیت موجودی",
        center: true,
        cell: (row) => {
          if (row.isdelete) {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#ffdbdb",
                  color: "#ff0000",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() =>
                  showApplyChangesSwal(() =>
                    deletionMutate({ active: false, id: row.courseId })
                  )
                }
              >
                ناموجود
              </span>
            );
          } else {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#cafade",
                  color: "#28c76f",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() =>
                  showApplyChangesSwal(() =>
                    deletionMutate({ active: true, id: row.courseId })
                  )
                }
              >
                موجود
              </span>
            );
          }
        },
      },
      {
        name: "وضعیت",
        center: true,
        selector: (row) => row.isActive,
        cell: (row) => {
          if (row.isActive) {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#cafade",
                  color: "#28c76f",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() => {
                  showApplyChangesSwal(() =>
                    mutateAsync({ active: false, id: row.courseId })
                  );
                }}
              >
                فعال
              </span>
            );
          } else {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#ffdbdb",
                  color: "#ff0000",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() => {
                  showApplyChangesSwal(() =>
                    mutateAsync({ active: true, id: row.courseId })
                  );
                }}
              >
                غیر فعال
              </span>
            );
          }
        },
      },
      {
        name: "انتخاب",
        center: true,
        cell: (row) => (
          <Button
            color="primary"
            onClick={() => {
              if (editObj) {
                setEditObj((prev) => ({ ...prev, courseId: row.courseId }));
                toast.success("دوره انتخاب شد");
              } else {
                setObj((prev) => ({ ...prev, courseId: row.courseId }));
              }
            }}
          >
            انتخاب
          </Button>
        ),
      },
    ];
  } else {
    columns = [
      {
        name: "نام دوره",
        minWidth: "300px",
        selector: (row) => row.title,
        cell: (row) => (
          <div className="d-flex justify-content-left align-items-center">
            {renderCourse(row)}
            <div className="d-flex">
              <span>{row.title}</span>
            </div>
          </div>
        ),
      },
      {
        name: "مدرس دوره",
        center: true,
        selector: (row) => row.fullName,
      },
      {
        name: "نوع دوره",
        center: true,
        selector: (row) => row.typeName,
      },
      {
        name: "سطح دوره",
        center: true,
        selector: (row) => row.levelName,
      },
      {
        name: "وضعیت موجودی",
        center: true,
        cell: (row) => {
          if (row.isdelete) {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#ffdbdb",
                  color: "#ff0000",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() =>
                  showApplyChangesSwal(() =>
                    deletionMutate({ active: false, id: row.courseId })
                  )
                }
              >
                ناموجود
              </span>
            );
          } else {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#cafade",
                  color: "#28c76f",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() =>
                  showApplyChangesSwal(() =>
                    deletionMutate({ active: true, id: row.courseId })
                  )
                }
              >
                موجود
              </span>
            );
          }
        },
      },
      {
        name: "وضعیت",
        center: true,
        selector: (row) => row.isActive,
        cell: (row) => {
          if (row.isActive) {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#cafade",
                  color: "#28c76f",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() => {
                  showApplyChangesSwal(() =>
                    mutateAsync({ active: false, id: row.courseId })
                  );
                }}
              >
                فعال
              </span>
            );
          } else {
            return (
              <span
                style={{
                  padding: 4,
                  backgroundColor: "#ffdbdb",
                  color: "#ff0000",
                  cursor: "pointer",
                }}
                className="rounded-1"
                onClick={() => {
                  showApplyChangesSwal(() =>
                    mutateAsync({ active: true, id: row.courseId })
                  );
                }}
              >
                غیر فعال
              </span>
            );
          }
        },
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
              <DropdownMenu container="body">
                <DropdownItem
                  tag="span"
                  className="w-100"
                  onClick={() => {
                    if (row.isActive) {
                      navigate(`/courses/view/${row.courseId}`);
                    } else {
                      toast.error("لطفا ابتدا دوره را فعال کنید");
                    }
                  }}
                >
                  <FileText size={14} className="me-50" />
                  <span className="align-middle">جزئیات دوره</span>
                </DropdownItem>
                {row.isActive ? (
                  <DropdownItem
                    tag="span"
                    className="w-100"
                    onClick={() => {
                      showApplyChangesSwal(() =>
                        mutateAsync({ active: false, id: row.courseId })
                      );
                    }}
                  >
                    <Edit2 size={14} className="me-50" />
                    <span className="align-middle">غیر فعال کردن</span>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    tag="span"
                    className="w-100"
                    onClick={() => {
                      showApplyChangesSwal(() =>
                        mutateAsync({ active: true, id: row.courseId })
                      );
                    }}
                  >
                    <Edit2 size={14} className="me-50" />
                    <span className="align-middle">فعال کردن</span>
                  </DropdownItem>
                )}
                {row.isdelete ? (
                  <DropdownItem
                    tag="span"
                    className="w-100"
                    onClick={() =>
                      showApplyChangesSwal(() =>
                        deletionMutate({ active: false, id: row.courseId })
                      )
                    }
                  >
                    <Check size={14} className="me-50" />
                    <span className="align-middle">موجود کردن</span>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    tag="span"
                    className="w-100"
                    onClick={() =>
                      showApplyChangesSwal(() =>
                        deletionMutate({ active: true, id: row.courseId })
                      )
                    }
                  >
                    <X size={14} className="me-50" />
                    <span className="align-middle">حذف کردن</span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        ),
      },
    ];
  }

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(data.data.totalCount / RowsOfPage));
    return (
      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          pageCount={count || 1}
          activeClassName="active"
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={(page) => handlePagination(page)}
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
          data={data.data.courseDtos}
          subHeaderComponent={
            <AllCoursesCustomHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
              currentStatus={currentStatus}
              setCurrentStatus={setCurrentStatus}
              refetch={refetch}
              needAddNewCourse={needAddNewCourse}
              setStep={setStep}
              setEditStep={setEditStep}
              setObj={setObj}
              editObj={editObj}
              setEditModal={setEditModal}
            />
          }
        />
      </div>
    </Card>
  );
};

export default CoursesListTable;
