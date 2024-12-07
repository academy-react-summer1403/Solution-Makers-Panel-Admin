import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "reactstrap";
import DataTable from "react-data-table-component";
import { Eye } from "react-feather";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { getUserById } from "../../../services/api/Users";
import { useState } from "react";
import SearchComponent from "../../common/SearchComponent";

function UserReserveCourses() {
  const { userId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(userId),
  });

  const columns = [
    {
      name: "نام دوره",
      selector: (row) => row.courseName,
    },
    {
      name: "تاریخ رزرو",
      center: true,
      selector: (row) => row.reserverDate.slice(0, 10),
    },
    {
      name: "وضعیت",
      center: true,
      cell: (row) => {
        if (row.accept) {
          return (
            <span
              className="rounded-2"
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
              className="rounded-2"
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
      },
    },
    {
      name: "مشاهده جزئیات دوره",
      center: true,
      cell: (row) => (
        <Link
          style={{ all: "unset", cursor: "pointer" }}
          to={`/courses/view/${row.courseId}`}
        >
          <Eye size={20} />
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return <p>loading data ...</p>;
  }

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>;
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
            data={data?.data.coursesReseves.filter((item) => {
              if (!searchTerm) {
                return item;
              } else {
                const pattern = new RegExp(`${searchTerm}`, "i");
                return pattern.test(item.courseName);
              }
            })}
            className="react-dataTable"
          />
        </div>
      </Card>
    </>
  );
}

export default UserReserveCourses;
