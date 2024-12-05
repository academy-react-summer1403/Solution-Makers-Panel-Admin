import { BookOpen, CheckCircle, MinusCircle, Slash } from "react-feather";
import { Col, Spinner } from "reactstrap";
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";
import { useQuery } from "@tanstack/react-query";
import { getCoursesStatistics } from "../../../services/api/Courses";
import ErrorComponent from "../../common/ErrorComponent";

function CoursesListTopCards() {
  const { data, error } = useQuery({
    queryKey: ["nums"],
    queryFn: getCoursesStatistics,
  });

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <Col lg="3" sm="6">
        <StatsHorizontal
          color="primary"
          statTitle="مجموع دوره های سایت"
          icon={<BookOpen size={20} />}
          renderStats={
            <h3 className="fw-bolder mb-75">
              {data?.data.courseDtos.length || <Spinner color="primary" />}
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
              {data?.data.courseDtos.filter((course) => course.isActive)
                .length || <Spinner color="primary" />}
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
              {data?.data.courseDtos.filter((course) => course.isExpire)
                .length || <Spinner color="primary" />}
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
              {data?.data.courseDtos.filter((course) => course.isdelete)
                .length || <Spinner color="primary" />}
            </h3>
          }
        />
      </Col>
    </>
  );
}

export default CoursesListTopCards;
