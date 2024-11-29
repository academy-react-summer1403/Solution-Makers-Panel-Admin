import { Col, Row } from "reactstrap";
import StatsVertical from "@components/widgets/stats/StatsVertical";
import { Users, ThumbsUp, ShoppingBag } from "react-feather";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseByIdAdmin } from "../../../services/api/Courses";

function OtherInfos() {
  const { courseId } = useParams();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: getCourseByIdAdmin
  });

  if (isLoading) {
    return <span>loading data ...</span>;
  }

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>
  }

  return (
    <Row>
      <Col xl="3" sm="6">
        <StatsVertical
          icon={<Users size={21} />}
          color="primary"
          stats={String(data.data.reserveUserTotal)}
          statTitle="رزرو کننده"
        />
      </Col>
      <Col xl="3" sm="6">
        <StatsVertical
          icon={<ThumbsUp size={21} />}
          color="success"
          stats={String(data.data.courseLikeTotal)}
          statTitle="نفر پسندیدند"
        />
      </Col>
      <Col xl="3" sm="6">
        <StatsVertical
          icon={<ShoppingBag size={21} />}
          color="success"
          stats={String(data.data.paymentDoneTotal)}
          statTitle="خرید موفق"
        />
      </Col>
      <Col xl="3" sm="6">
        <StatsVertical
          icon={<ShoppingBag size={21} />}
          color="warning"
          stats={String(data.data.paymentNotDoneTotal)}
          statTitle="خرید در انتظار پرداخت"
        />
      </Col>
    </Row>
  );
}

export default OtherInfos;
