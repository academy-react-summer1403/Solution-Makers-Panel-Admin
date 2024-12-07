import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import Avatar from "@components/avatar";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeacherCourses } from "../../services/api/Teachers";
import {
  activateOrDeactiveCourse,
  deleteCourse,
} from "../../services/api/Courses";
import {
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Check, Edit2, FileText, MoreHorizontal, X } from "react-feather";
import ErrorComponent from "../common/ErrorComponent";
import toast from "react-hot-toast";
import { showApplyChangesSwal } from "../../utility/Utils";
import TeacherCourseListHeader from "./CustomHeader";

function TeacherCoursesListTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["teacherCourses"],
    queryFn: () => getTeacherCourses(currentPage, searchTerm),
  });

  const { mutateAsync } = useMutation({
    mutationFn: activateOrDeactiveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries("teacherCourses");
    },
    onError: () => {
      toast.error("error");
    },
  });

  const { mutateAsync: deletionMutate } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["teacherCourses"]);
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

  const columns = [
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

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(data.data.totalCount / 10));
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

  console.log(data?.data.teacherCourseDtos);

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
          data={data.data.teacherCourseDtos}
          subHeaderComponent={
            <TeacherCourseListHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setCurrentPage={setCurrentPage}
              refetch={refetch}
            />
          }
        />
      </div>
    </Card>
  );
}

export default TeacherCoursesListTable;
