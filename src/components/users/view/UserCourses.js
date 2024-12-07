import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card } from "reactstrap";
import Avatar from "@components/avatar";
import DataTable from "react-data-table-component";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { getUserById } from "../../../services/api/Users";
import SearchComponent from "../../common/SearchComponent";
import { useState } from "react";

function UserCourses() {
  const { userId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

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
          dangerouslySetInnerHTML={{ __html: row.describe }}
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        ></p>
      ),
    },
    {
      name: "آخرین بروزرسانی",
      center: true,
      selector: (row) => row.lastUpdate.slice(0, 10),
    },
  ];

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
            data={data?.data.courses.filter((item) => {
              if (!searchTerm) {
                return item;
              } else {
                const pattern = new RegExp(`${searchTerm}`, "i");
                return pattern.test(item.title) || pattern.test(item.describe);
              }
            })}
            className="react-dataTable"
          />
        </div>
      </Card>
    </>
  );
}

export default UserCourses;
