import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Select from "react-select";
import { Check, X } from "react-feather";
import { selectThemeColors, showApplyChangesSwal } from "../../utility/Utils";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { deleteCourseReserve, getAllCoursesReserveList, getCourseByIdAdmin, getCourseGroups, submitCourseReserve } from "../../services/api/Courses";

function ReserveListTable() {
  const [basicModal, setBasicModal] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [currentGroup, setCurrentGroup] = useState({
    value: "",
    label: "انتخاب گروه",
    number: 0,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["allCoursesReserveList"],
    queryFn: getAllCoursesReserveList,
  });

  const {
    data: courseGroups,
    error: courseGroupsError,
    refetch: refetchCourseGroups,
  } = useQuery({
    queryKey: ["courseGroups"],
    queryFn: () => getCourseGroups(teacherId, courseId),
    enabled: false,
  });

  const { data: courseDetails, refetch } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => getCourseByIdAdmin(courseId),
    enabled: false,
  });

  const { mutateAsync: reserveCourseMutate } = useMutation({
    mutationFn: submitCourseReserve,
    onSuccess: () => {
      queryClient
        .invalidateQueries("allCoursesReserveList")
        .then(() => toast.success("رزرو تایید شد"));
    },
  });

  const { mutateAsync: deletionMutate } = useMutation({
    mutationFn: deleteCourseReserve,
    onSuccess: () => {
      queryClient.invalidateQueries("courseReserveList");
    },
  });

  useEffect(() => {
    if (courseId) {
      refetch();
    }
  }, [courseId]);

  useEffect(() => {
    if (courseDetails) {
      setTeacherId(courseDetails.data.teacherId);
    }
  }, [courseDetails]);

  useEffect(() => {
    if (teacherId) {
      refetchCourseGroups();
    }
  }, [teacherId]);

  useEffect(() => {
    if (courseGroups) {
      if (courseGroups.data.length > 0) {
        setBasicModal(!basicModal);
      } else {
        Swal.fire({
          title: "برای این دوره هیچ گروهی وجود نداره",
          text: "میخوای گروه جدید بسازی ؟",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "بله",
          cancelButtonText: "خیر",
          customClass: {
            confirmButton: "mx-1 px-2 fs-5 rounded-2",
            cancelButton: "mx-1 px-2 fs-5 rounded-2",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`/courses/view/${courseId}`);
          }
        });
      }
    }
  }, [courseGroups]);

  const columns = [
    {
      name: "نام دوره",
      selector: (row) => row.courseName,
    },
    {
      name: "نام دانشجو",
      selector: (row) => row.studentName,
    },
    {
      name: "تاریخ رزرو",
      selector: (row) => row.reserverDate.slice(0, 10),
    },
    {
      name: "وضعیت",
      cell: (row) => {
        if (row.accept) {
          return (
            <span
              style={{
                padding: 4,
                backgroundColor: "#cafade",
                color: "#28c76f",
                cursor: "pointer",
              }}
              className="rounded-1"
            >
              تایید شده
            </span>
          );
        } else {
          return (
            <span
              style={{
                padding: 4,
                backgroundColor: "#ffdbdb",
                color: "#ff0000",
                cursor: "pointer",
              }}
              className="rounded-1"
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
            <div className="column-action d-flex gap-1">
              <span
                style={{
                  padding: 2,
                  backgroundColor: "#cafade",
                  color: "#28c76f",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCourseId(row.courseId);
                  setStudentId(row.studentId);
                }}
              >
                <Check />
              </span>
              <span
                style={{
                  padding: 2,
                  backgroundColor: "#ffdbdb",
                  color: "#ff0000",
                  cursor: "pointer",
                }}
                onClick={() =>
                  showApplyChangesSwal(() => deletionMutate(row.reserveId))
                }
              >
                <X />
              </span>
            </div>
          );
        }
      },
    },
  ];

  if (isLoading) {
    return <span>loading data ...</span>
  }

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>
  }

  return (
    <Card className="overflow-hidden">
      <div className="react-dataTable">
        <DataTable
          noHeader
          subHeader
          responsive
          columns={columns}
          className="react-dataTable"
          data={data.data}
          subHeaderComponent={
            <h3 className="text-center w-100 py-1">لیست دوره های رزرو شده</h3>
          }
        />
      </div>

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
              onChange={(data) => setCurrentGroup(data)}
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
    </Card>
  );
}

export default ReserveListTable;
