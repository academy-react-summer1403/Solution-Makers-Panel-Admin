import { Col } from "reactstrap";
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";
import { User } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import { getUsersStatistics } from "../../../services/api/Users";

function UsersListTopCards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["usersStatistics"],
    queryFn: getUsersStatistics,
  });

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>
  }

  return (
    <>
      <Col lg="3" sm="6">
        <StatsHorizontal
          color="primary"
          statTitle="کل کاربران"
          icon={<User size={20} />}
          renderStats={
            <h3 className="fw-bolder mb-75">{data?.data.totalCount}</h3>
          }
        />
      </Col>
      <Col lg="3" sm="6">
        <StatsHorizontal
          color="success"
          statTitle="ادمین ها"
          icon={<User size={20} />}
          renderStats={
            <h3 className="fw-bolder mb-75">
              {
                data?.data.listUser.filter(
                  (user) =>
                    user.userRoles != null &&
                    user.userRoles.includes("Administrator")
                ).length
              }
            </h3>
          }
        />
      </Col>
      <Col lg="3" sm="6">
        <StatsHorizontal
          color="warning"
          statTitle="اساتید"
          icon={<User size={20} />}
          renderStats={
            <h3 className="fw-bolder mb-75">
              {
                data?.data.listUser.filter(
                  (user) =>
                    user.userRoles != null && user.userRoles.includes("Teacher")
                ).length
              }
            </h3>
          }
        />
      </Col>
      <Col lg="3" sm="6">
        <StatsHorizontal
          color="info"
          statTitle="دانشجویان"
          icon={<User size={20} />}
          renderStats={
            <h3 className="fw-bolder mb-75">
              {
                data?.data.listUser.filter(
                  (user) =>
                    user.userRoles != null && user.userRoles.includes("Student")
                ).length
              }
            </h3>
          }
        />
      </Col>
    </>
  );
}

export default UsersListTopCards;
