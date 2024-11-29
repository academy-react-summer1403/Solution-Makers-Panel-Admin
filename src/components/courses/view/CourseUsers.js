import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import { Card, Spinner } from "reactstrap";
import {
  getCourseGroupById,
  getCourseUserList,
  getCourseUserListTotalCount,
} from "../../../services/api/Courses";
import CourseUsersCustomHeader from "./CustomHeader";
import ErrorComponent from "../../common/ErrorComponent";

function CourseUsers() {
  const { courseId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseUsersList"],
    queryFn: () => getCourseUserList(courseId, currentPage, searchTerm),
  });

  const { data: totalCount } = useQuery({
    queryKey: ["courseUserListTotalCount"],
    queryFn: () => getCourseUserListTotalCount(courseId),
  });

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const columns = [
    {
      name: "نام کاربر",
      center: true,
      selector: (row) => row.studentName,
    },
    {
      name: "نام گروه",
      center: true,
      cell: (row) => {
        const [groupName, setGroupName] = useState("groupName");
        const [loading, setLoading] = useState(true);
        const [isError, setIsError] = useState(false);
        getCourseGroupById(row.courseGroupId)
          .then((res) => {
            setGroupName(res.data.courseGroupDto.groupName);
            setLoading(false);
          })
          .catch((err) => setIsError(true));
        if (loading) {
          return <Spinner type="grow" color="primary" />;
        }
        if (isError) {
          return <ErrorComponent />;
        }
        return <span>{groupName}</span>;
      },
    },
    {
      name: "ظرفیت گروه",
      center: true,
      cell: (row) => {
        const [groupCapacity, setGroupCapacity] = useState("");
        const [loading, setLoading] = useState(true);
        const [isError, setIsError] = useState(false);
        getCourseGroupById(row.courseGroupId)
          .then((res) => {
            setGroupCapacity(res.data.courseGroupDto.groupCapacity);
            setLoading(false);
          })
          .catch((err) => setIsError(true));
        if (loading) {
          return <Spinner type="grow" color="primary" />;
        }
        if (isError) {
          return <ErrorComponent />;
        }
        return <span>{groupCapacity}</span>;
      },
    },
    {
      name: "وضعیت پرداخت",
      cell: (row) => {
        if (row.peymentDone) {
          return (
            <span
              className="rounded-1"
              style={{
                padding: 4,
                backgroundColor: "#cafade",
                color: "#28c76f",
              }}
            >
              پرداخت شده
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
              پرداخت نشده
            </span>
          );
        }
      },
    },
  ];

  const CustomPagination = () => {
    const count = Number(Math.ceil(totalCount?.data.length / 10));
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
          data={data?.data}
          subHeaderComponent={
            <CourseUsersCustomHeader
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

export default CourseUsers;
