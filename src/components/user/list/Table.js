import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import Avatar from "@components/avatar";
import { Link } from "react-router-dom";
import { ChevronDown } from "react-feather";
import {
  Card,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Edit2, MoreHorizontal, FileText } from "react-feather";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import instance from "../../../services/middleware";
import AllCoursesCustomHeader from "./CustomHeader";
import toast from "react-hot-toast";
import { showApplyChangesSwal } from "../../../utility/Utils";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const CoursesListTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: "مرتب سازی",
    number: 0,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: () =>
      instance.get(
        `/Course/CourseList?PageNumber=${currentPage}&RowsOfPage=10&SortingCol=DESC&SortType=Expire&${
          searchTerm ? `Query=${searchTerm}` : ""
        }`
      ),
  });

  const activateOrDeactiveCourse = (obj) =>
    instance.put("/Course/ActiveAndDeactiveCourse", obj);

  const isDeleteCourse = (obj) =>
    instance.delete("/Course/DeleteCourse", { data: obj });

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: activateOrDeactiveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries("courses");
    },
    onError: () => {
      toast.error("error");
    },
  });

  const { mutateAsync: deletionMutate } = useMutation({
    mutationFn: isDeleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(["courses", "nums"]);
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
        <div
          className="d-flex justify-content-left align-items-center"
          onClick={() => console.log(row.courseId)}
        >
          {renderCourse(row)}
          <div className="d-flex">
            <span>{row.title}</span>
          </div>
        </div>
      ),
    },
    {
      name: "مدرس دوره",
      selector: (row) => row.fullName,
    },
    {
      name: "نوع دوره",
      selector: (row) => row.typeName,
    },
    {
      name: "سطح دوره",
      selector: (row) => row.levelName,
    },
    {
      name: "وضعیت موجودی",
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
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreHorizontal size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem
                tag={Link}
                className="w-100"
                to={`/courses/view/${row.courseId}`}
              >
                <FileText size={14} className="me-50" />
                <span className="align-middle">جزئیات دوره</span>
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => e.preventDefault()}
              >
                <Edit2 size={14} className="me-50" />
                <span className="align-middle">ویرایش دوره</span>
              </DropdownItem>
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
    return <span>loading data ...</span>;
  }

  return (
    <Card className="overflow-hidden">
      <div className="react-dataTable">
        <DataTable
          noHeader
          subHeader
          sortServer
          pagination
          responsive
          paginationServer
          columns={columns}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          paginationComponent={CustomPagination}
          data={data.data.courseDtos}
          subHeaderComponent={
            <AllCoursesCustomHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentStatus={currentStatus}
              setCurrentStatus={setCurrentStatus}
              refetch={refetch}
            />
          }
        />
      </div>
    </Card>
  );
};

export default CoursesListTable;
