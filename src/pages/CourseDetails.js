import { useState } from "react";
import { Row, Col } from "reactstrap";
import CourseDetailsTabs from "../components/courses/view/Tabs";
import CourseInfoCard from "../components/courses/view/CourseInfoCard";
import "@styles/react/apps/app-users.scss";

const CourseDetails = () => {
  const [active, setActive] = useState("1");

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <div className="app-user-view">
      <Row>
        <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <CourseInfoCard toggleTab={toggleTab} />
        </Col>
        <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <CourseDetailsTabs active={active} toggleTab={toggleTab} />
        </Col>
      </Row>
    </div>
  );
};
export default CourseDetails;
