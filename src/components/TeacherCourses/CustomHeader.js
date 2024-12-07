import { useNavigate } from "react-router-dom";
import { Button, Col, Input, Row } from "reactstrap";

function TeacherCourseListHeader({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  refetch,
}) {
  const navigate = useNavigate();
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row className="align-items-center">
        <Col md="4">
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              placeholder="جستجو ...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => {
                if (e.key == "Enter") {
                  setCurrentPage(1);
                  refetch();
                }
              }}
            />
          </div>
        </Col>

        <Col
          md="8"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1 gap-1"
        >
          <div className="d-flex align-items-center gap-1 table-header-actions">
            <Button
              className="add-new-user"
              color="primary"
              onClick={() => navigate("/add-course")}
            >
              ساخت دوره جدید
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TeacherCourseListHeader;
