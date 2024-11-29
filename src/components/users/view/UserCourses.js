import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card } from "reactstrap";
import Avatar from "@components/avatar";
import DataTable from "react-data-table-component";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { getUserById } from "../../../services/api/Users";

function UserCourses() {
  const { userId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(userId),
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
      name: "توضیحات دوره",
      center: true,
      maxWidth: "300px",
      cell: (row) => (
        <p
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {row.describe}
        </p>
      ),
    },
    {
      name: "آخرین بروزرسانی",
      center: true,
      selector: (row) => row.lastUpdate.slice(0, 10),
    },
  ];

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>
  }

  return (
    <Card>
      <div className="react-dataTable user-view-account-projects">
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={data?.data.courses}
          className="react-dataTable"
        />
      </div>
    </Card>
  );
}

export default UserCourses;
