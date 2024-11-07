import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import instance from "../../../services/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CheckCircle, MoreHorizontal, Trash } from "react-feather";
import { showApplyChangesSwal } from "../../../utility/Utils";
import toast from "react-hot-toast";

const BillingTab = () => {
  const { courseId } = useParams();

  const queryClient = useQueryClient();

  const getCourseGroups = (TeacherId, CourseId) =>
    instance.get(
      `/CourseGroup/GetCourseGroup?TeacherId=${TeacherId}&CourseId=${CourseId}`
    );

  const deleteCourseGroup = (id) => {
    const formData = new FormData();
    formData.append("Id", id);
    return instance.delete("/CourseGroup", {
      data: formData,
    });
  };

  const createNewCourseGroup = () => {
    const formData = new FormData();
    formData.append("GroupName", "test group");
    formData.append("CourseId", courseId);
    formData.append("GroupCapacity", 50);
    return instance.post("/CourseGroup", formData);
  };

  const courseDetails = queryClient.getQueryData(["courseDetails", courseId]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseGroups"],
    queryFn: () => getCourseGroups(courseDetails?.data.teacherId, courseId),
    enabled: false,
  });

  const { mutateAsync: deleteCourseGroupMutate } = useMutation({
    mutationFn: deleteCourseGroup,
    onSuccess: () => {
      refetch().then(() => toast.success("گروه حذف شد"));
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const { mutateAsync: addNewGroupMutate } = useMutation({
    mutationFn: createNewCourseGroup,
    onSuccess: () => {
      refetch().then(() => toast.success("گروه جدید ساخته شد"));
    },
  });

  useEffect(() => {
    if (courseDetails) {
      refetch();
    }
  }, [courseDetails]);

  console.log(data?.data);

  const columns = [
    {
      name: "نام گروه",
      selector: (row) => row.groupName,
    },
    {
      name: "ظرفیت",
      selector: (row) => row.groupCapacity,
    },
    {
      minWidth: "300px",
      name: "نام مدرس",
      selector: (row) => row.teacherName,
    },
    {
      name: "عملیات",
      cell: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreHorizontal size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu className="mb-4" container="body">
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  // setStudentId(row.studentId);
                  // refetch().then(() => setBasicModal(!basicModal));
                }}
              >
                <CheckCircle size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={
                  () =>
                    showApplyChangesSwal(() =>
                      deleteCourseGroupMutate(row.groupId)
                    )
                  // showApplyChangesSwal(() => deletionMutate(row.reserveId))
                }
              >
                <Trash size={14} className="me-50" />
                <span className="align-middle">حذف</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <span>loading data ....</span>;
  }

  return (
    <>
      <div className="d-flex justify-content-end py-1">
        <Button color="primary" onClick={() => addNewGroupMutate()}>
          ساخت گروه
        </Button>
      </div>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            sortServer
            responsive
            data={data?.data}
            columns={columns}
            className="react-dataTable"
          />
        </div>
      </Card>
    </>
  );
};

export default BillingTab;
