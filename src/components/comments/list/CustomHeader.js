import { Button, Col, Input, Row } from "reactstrap";

function AllCommentsCustomHeader({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  refetch,
}) {
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row className="justify-content-end align-items-center">
        <Col className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1">
          <div className="d-flex align-items-center mb-sm-0 mb-1 mx-1 border border-2 rounded">
            <Input
              id="search-invoice"
              className="w-100 border-0"
              type="text"
              placeholder="جستجو ...."
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key == "Enter") {
                  refetch();
                }
              }}
            />
            <Button color="primary" onClick={() => refetch()}>
              جستجو
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AllCommentsCustomHeader;
