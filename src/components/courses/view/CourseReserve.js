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
import { ChevronDown, Trash, CheckCircle, MoreHorizontal } from "react-feather";
import DataTable from "react-data-table-component";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  selectThemeColors,
  showApplyChangesSwal,
} from "../../../utility/Utils";
import Select from "react-select";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  deleteCourseReserve,
  getCourseGroups,
  getCourseReserveList,
  submitCourseReserve,
} from "../../../services/api/Courses";
import ErrorComponent from "../../common/ErrorComponent";

const CourseReserve = ({ toggleTab }) => {
  const { courseId } = useParams();
  const [basicModal, setBasicModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [currentGroup, setCurrentGroup] = useState({
    value: "",
    label: "انتخاب گروه",
    number: 0,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["courseReserveList"],
    queryFn: () => getCourseReserveList(courseId),
  });

  const courseDetails = queryClient.getQueryData(["courseDetails", courseId]);

  const {
    data: courseGroups,
    error: courseGroupsError,
    refetch,
  } = useQuery({
    queryKey: ["courseGroups"],
    queryFn: () => getCourseGroups(courseDetails?.data.teacherId, courseId),
    enabled: false,
  });

  const { mutateAsync: reserveCourseMutate } = useMutation({
    mutationFn: submitCourseReserve,
    onSuccess: () => {
      queryClient
        .invalidateQueries("courseReserveList")
        .then(() => toast.success("رزرو تایید شد"));
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const { mutateAsync: deletionMutate } = useMutation({
    mutationFn: deleteCourseReserve,
    onSuccess: () => {
      queryClient.invalidateQueries("courseReserveList");
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  const columns = [
    {
      name: "نام رزرو کننده",
      center: true,
      selector: (row) => row.studentName,
    },
    {
      name: "نام دوره",
      center: true,
      selector: (row) => row.courseName,
    },
    {
      name: "وضعیت",
      center: true,
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
      center: true,
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
                      refetch().then(() => {
                        if (courseGroups?.data.length > 0) {
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
                              toggleTab("3");
                            }
                          });
                        }
                      });
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

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>;
  }

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
            {courseGroupsError ? (
              <ErrorComponent />
            ) : (
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
            )}
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

export default CourseReserve;
