import { Button, Col, Input, Row } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function ArticlesListCustomHeader({
  searchTerm,
  setSearchTerm,
  sortingCol,
  setSortingCol,
  currentStatus,
  setCurrentStatus,
  setCurrentPage,
  refetch,
}) {
  const navigate = useNavigate();

  const statusOptions = [
    { value: "false", label: "غیر فعال", number: 1 },
    { value: "true", label: "فعال", number: 2 },
  ];

  const sortingColOptions = [
    { value: "currentView", label: "پربازدید ترین", number: 1 },
    { value: "currentRate", label: "محبوب ترین", number: 2 },
    { value: "insertDate", label: "جدید ترین", number: 3 },
  ];

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
          <Select
            theme={selectThemeColors}
            isClearable={false}
            className="react-select"
            classNamePrefix="select"
            options={statusOptions}
            value={currentStatus}
            onChange={(data) => {
              setCurrentStatus(data);
              setCurrentPage(1);
            }}
          />

          <Select
            theme={selectThemeColors}
            isClearable={false}
            className="react-select"
            classNamePrefix="select"
            options={sortingColOptions}
            value={sortingCol}
            onChange={(data) => {
              setSortingCol(data);
              setCurrentPage(1);
            }}
          />
          <div className="d-flex align-items-center table-header-actions">
            <Button
              className="add-new-user"
              color="primary"
              onClick={() => navigate("/add-news")}
            >
              ساخت مقاله جدید
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ArticlesListCustomHeader;
