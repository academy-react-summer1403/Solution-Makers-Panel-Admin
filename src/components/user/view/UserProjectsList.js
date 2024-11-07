// ** Reactstrap Imports
import {
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
} from "reactstrap";

// ** Third Party Components
import { ChevronDown, Trash, CheckCircle, MoreHorizontal } from "react-feather";
import DataTable from "react-data-table-component";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../../../services/middleware";
import { useParams } from "react-router-dom";
import {
  selectThemeColors,
  showApplyChangesSwal,
} from "../../../utility/Utils";
import Select from "react-select";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserProjectsList = () => {
  const { courseId } = useParams();
  const [basicModal, setBasicModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [currentGroup, setCurrentGroup] = useState({
    value: "",
    label: "انتخاب گروه",
    number: 0,
  });

  const queryClient = useQueryClient();

  const getCourseReserveList = (id) => instance.get(`/CourseReserve/${id}`);

  const { data, isLoading, error } = useQuery({
    queryKey: ["courseReserveList"],
    queryFn: () => getCourseReserveList(courseId),
  });

  const getCourseGroups = (TeacherId, CourseId) =>
    instance.get(
      `/CourseGroup/GetCourseGroup?TeacherId=${TeacherId}&CourseId=${CourseId}`
    );

  const courseDetails = queryClient.getQueryData(["courseDetails", courseId]);

  const {
    data: courseGroups,
    isLoading: courseGroupsLoading,
    error: courseGroupsError,
    refetch,
  } = useQuery({
    queryKey: ["courseGroups"],
    queryFn: () => getCourseGroups(courseDetails?.data.teacherId, courseId),
    enabled: false,
  });

  const submitCourseReserve = (obj) =>
    instance.post("/CourseReserve/SendReserveToCourse", obj);

  const { mutateAsync: reserveCourseMutate } = useMutation({
    mutationFn: submitCourseReserve,
    onSuccess: () => {
      queryClient
        .invalidateQueries("courseReserveList")
        .then(() => toast.success("رزرو تایید شد"));
    },
  });

  // console.log(courseDetails?.data.teacherId);
  // console.log(courseGroups?.data);

  // console.log(data?.data);

  useEffect(() => {
    console.log(studentId);
  }, [studentId]);

  const deleteCourseReserve = (id) =>
    instance.delete("/CourseReserve", { data: { id } });

  const { mutateAsync: deletionMutate } = useMutation({
    mutationFn: deleteCourseReserve,
    onSuccess: () => {
      queryClient.invalidateQueries("courseReserveList");
    },
  });

  const columns = [
    {
      minWidth: "300px",
      name: "نام رزرو کننده",
      selector: (row) => row.studentName,
    },
    {
      name: "نام دوره",
      selector: (row) => row.courseName,
    },
    {
      name: "وضعیت",
      selector: (row) => row.accept,
      cell: (row) => {
        if (row.accept) {
          return (
            <span
              className="rounded-2"
              style={{
                padding: 4,
                backgroundColor: "#cafade",
                color: "#28c76f",
              }}
            >
              تایید شده
            </span>
          );
        } else {
          return (
            <span
              className="rounded-2"
              style={{
                padding: 4,
                backgroundColor: "#ffdbdb",
                color: "#ff0000",
              }}
            >
              تایید نشده
            </span>
          );
        }
      },
    },
    {
      name: "عملیات",
      cell: (row) => {
        if (!row.accept) {
          return (
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
                      setStudentId(row.studentId);
                      refetch().then(() => setBasicModal(!basicModal));
                    }}
                  >
                    <CheckCircle size={14} className="me-50" />
                    <span className="align-middle">تایید</span>
                  </DropdownItem>
                  <DropdownItem
                    tag="span"
                    className="w-100"
                    onClick={() =>
                      showApplyChangesSwal(() => deletionMutate(row.reserveId))
                    }
                  >
                    <Trash size={14} className="me-50" />
                    <span className="align-middle">حذف</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          );
        }
      },
    },
  ];

  return (
    <>
      <Card>
        <div className="react-dataTable user-view-account-projects">
          <DataTable
            noHeader
            responsive
            columns={columns}
            data={data?.data}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
          />
        </div>
      </Card>
      <div className="basic-modal">
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>
            <span style={{ fontSize: 24 }}>لطفا گروه را انتخاب کنید</span>
          </ModalHeader>
          <ModalBody>
            <Select
              theme={selectThemeColors}
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              options={courseGroups?.data.map((group, index) => ({
                value: group.groupId,
                label: group.groupName,
                number: index + 1,
              }))}
              value={currentGroup}
              onChange={(data) => {
                setCurrentGroup(data);
                console.log(data);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!currentGroup.value}
              color="primary"
              onClick={() =>
                reserveCourseMutate({
                  courseId: courseId,
                  courseGroupId: currentGroup.value,
                  studentId: studentId,
                }).then(() => setBasicModal(!basicModal))
              }
            >
              ثبت
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default UserProjectsList;
