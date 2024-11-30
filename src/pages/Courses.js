import CoursesListTopCards from "../components/courses/list/CoursesListTopCards";
import CoursesListTable from "../components/courses/list/Table";
import { Row, Col } from "reactstrap";
import "@styles/react/apps/app-users.scss";

const CoursesList = () => {
  return (
    <div className="app-user-list">
      <Row>
        <CoursesListTopCards />
      </Row>
      <Row>
        <Col>
          <CoursesListTable />
        </Col>
      </Row>
    </div>
  );
};

export default CoursesList;
