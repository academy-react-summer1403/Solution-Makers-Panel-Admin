import CoursesListTable from "./Table";
import { Row, Col } from "reactstrap";
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";
import { BookOpen, CheckCircle, Slash, MinusCircle } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import instance from "../../../services/middleware";
import "@styles/react/apps/app-users.scss";

const CoursesList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["nums"],
    queryFn: () =>
      instance.get("/Course/CourseList?PageNumber=1&RowsOfPage=1000"),
  });

  return (
    <div className="app-user-list">
      <Row>
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="primary"
            statTitle="مجموع دوره های سایت"
            icon={<BookOpen size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {data?.data.courseDtos.length}
              </h3>
            }
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="success"
            statTitle="دوره های فعال"
            icon={<CheckCircle size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {
                  data?.data.courseDtos.filter((course) => course.isActive)
                    .length
                }
              </h3>
            }
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="warning"
            statTitle="دوره های منقضی شده"
            icon={<Slash size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {
                  data?.data.courseDtos.filter((course) => course.isExpire)
                    .length
                }
              </h3>
            }
          />
        </Col>
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="danger"
            statTitle="دوره های حذف شده"
            icon={<MinusCircle size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {
                  data?.data.courseDtos.filter((course) => course.isdelete)
                    .length
                }
              </h3>
            }
          />
        </Col>
      </Row>
      <CoursesListTable />
    </div>
  );
};

export default CoursesList;
