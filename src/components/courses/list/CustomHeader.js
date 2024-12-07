import { Button, Col, Input, Row } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssistance } from "../../../services/api/Assistance";
import toast from "react-hot-toast";

function AllCoursesCustomHeader({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  currentStatus,
  setCurrentStatus,
  refetch,
  needAddNewCourse,
  setStep,
  setEditStep,
  setObj,
  editObj,
  setEditModal,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const statusOptions = [
    { value: "", label: "مرتب سازی", number: 0 },
    { value: "active", label: "دوره های فعال", number: 2 },
    { value: "inactive", label: "دوره های غیرفعال", number: 3 },
    { value: "pending", label: "Pending", number: 1 },
  ];

  const { mutateAsync } = useMutation({
    mutationFn: updateAssistance,
    onSuccess: () => {
      queryClient.invalidateQueries("assistanceList");
      toast.success("اطلاعات ویرایش شد");
      setEditModal((prev) => !prev);
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

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
          {/* <Select
            theme={selectThemeColors}
            isClearable={false}
            className="react-select"
            classNamePrefix="select"
            options={statusOptions}
            value={currentStatus}
            onChange={(data) => setCurrentStatus(data)}
          /> */}

          <div className="d-flex align-items-center gap-1 table-header-actions">
            {needAddNewCourse ? (
              <Button
                className="add-new-user"
                color="primary"
                onClick={() => navigate("/add-course")}
              >
                ساخت دوره جدید
              </Button>
            ) : (
              <Button
                color="primary"
                onClick={() => {
                  if (setStep) {
                    setStep(1);
                    setObj({});
                  } else {
                    setEditStep(1);
                  }
                }}
              >
                بازگشت
              </Button>
            )}
            {editObj && (
              <Button color="success" onClick={() => mutateAsync(editObj)}>
                ویرایش
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default AllCoursesCustomHeader;
