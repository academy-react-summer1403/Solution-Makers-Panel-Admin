import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Edit2, Eye, MoreHorizontal, UserPlus } from "react-feather";
import ErrorComponent from "../common/ErrorComponent";
import DataTable from "react-data-table-component";
import {
  createAssistanceWork,
  getAllAssistance,
  getAssistanceById,
} from "../../services/api/Assistance";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import CourseAssistanceListHeader from "./CustomHeader";
import UsersListTable from "../users/list/Table";
import CoursesListTable from "../courses/list/Table";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import toast from "react-hot-toast";

const schema = yup.object({
  worktitle: yup
    .string()
    .required("عنوان تسک را وارد کنید")
    .min(5, "حداقل 5 حرف"),
  workDescribe: yup
    .string()
    .required("توضیحات تسک را وارد کنید")
    .min(5, "حداقل 5 حرف"),
  workDate: yup
    .date()
    .typeError("لطفا یک تاریخ معتبر وارد کنید")
    .required("تاریخ شروع تسک را وارد کنید"),
});

function CourseAssistanceListTable() {
  const [editModal, setEditModal] = useState(false);
  const [tasksModal, setTasksModal] = useState(false);
  const [assignTaskModal, setAssignTaskModal] = useState(false);
  const [editStep, setEditStep] = useState(1);
  const [editObj, setEditObj] = useState({});
  const [assistanceId, setAssistanceId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      worktitle: "",
      workDescribe: "",
      workDate: "",
    },
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["assistanceList"],
    queryFn: getAllAssistance,
  });

  const {
    data: assistanceByIdData,
    isLoading: assistanceByIdLoading,
    error: assistanceByIdError,
    refetch,
  } = useQuery({
    queryKey: ["assistanceById", assistanceId],
    queryFn: () => getAssistanceById(assistanceId),
    enabled: false,
  });

  const { mutateAsync } = useMutation({
    mutationFn: createAssistanceWork,
    onSuccess: () => {
      refetch();
      toast.success("تسک اساین شد");
      reset();
      setAssignTaskModal(!assignTaskModal);
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  useEffect(() => {
    if (assistanceId) {
      refetch();
    }
  }, [assistanceId]);

  const columns = [
    {
      name: "نام پشتیبان",
      center: true,
      selector: (row) => row.assistanceName,
    },
    {
      name: "نام دوره",
      center: true,
      selector: (row) => row.courseName,
    },
    {
      name: "تاریخ ثبت",
      center: true,
      selector: (row) => row.inserDate.slice(0, 10),
    },
    {
      name: "مشاهده تسک ها",
      center: true,
      cell: (row) => {
        return (
          <span
            className="cursor-pointer"
            onClick={() => {
              setAssistanceId(row.id);
              setTasksModal(!tasksModal);
            }}
          >
            <Eye />
          </span>
        );
      },
    },
    {
      name: "عملیات",
      center: true,
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
                  setEditModal(!editModal);
                  setEditObj({
                    id: row.id,
                    courseId: row.courseId,
                    userId: row.userId,
                  });
                }}
              >
                <Edit2 size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>

              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() => {
                  setAssistanceId(row.id);
                  setAssignTaskModal(!assignTaskModal);
                }}
              >
                <UserPlus size={14} className="me-50" />
                <span className="align-middle">اساین کردن تسک</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!editModal) {
      setEditStep(1);
    }
  }, [editModal]);

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            responsive
            columns={columns}
            className="react-dataTable"
            data={data?.data.filter((item) => {
              if (!searchTerm) {
                return item;
              } else {
                const pattern = new RegExp(`${searchTerm}`, "i");
                return (
                  pattern.test(item.assistanceName) ||
                  pattern.test(item.courseName)
                );
              }
            })}
            subHeaderComponent={
              <CourseAssistanceListHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            }
          />
        </div>
      </Card>

      <Modal
        isOpen={editModal}
        toggle={() => setEditModal(!editModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setEditModal(!editModal)}>
          {editStep == 1 ? "ویرایش پشتیبان دوره" : "ویرایش دوره پشتیبانی"}
        </ModalHeader>
        <ModalBody>
          {editStep == 1 ? (
            <UsersListTable
              RowsOfPage={5}
              needAddNewUser={false}
              needUserId={true}
              setEditStep={setEditStep}
              editObj={editObj}
              setEditObj={setEditObj}
            />
          ) : (
            <CoursesListTable
              RowsOfPage={5}
              needAddNewCourse={false}
              needCourseId={true}
              setEditStep={setEditStep}
              editObj={editObj}
              setEditObj={setEditObj}
              setEditModal={setEditModal}
            />
          )}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={tasksModal}
        toggle={() => setTasksModal(!tasksModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setTasksModal(!tasksModal)}></ModalHeader>
        <ModalBody>
          {assistanceByIdLoading ? (
            <Spinner color="primary" />
          ) : (
            <>
              {assistanceByIdError ? (
                <ErrorComponent />
              ) : (
                <Card className="overflow-hidden">
                  <div className="react-dataTable">
                    <DataTable
                      noHeader
                      responsive
                      columns={[
                        {
                          name: "عنوان تسک",
                          center: true,
                          selector: (row) => row.worktitle,
                        },
                        {
                          name: "شرح تسک",
                          center: true,
                          selector: (row) => row.workDescribe,
                        },
                        {
                          name: "نام دوره",
                          center: true,
                          selector: (row) => row.courseName,
                        },
                        {
                          name: "تاریخ شروع تسک",
                          center: true,
                          selector: (row) => row.workDate.slice(0, 10),
                        },
                      ]}
                      className="react-dataTable"
                      data={assistanceByIdData?.data.assistanceWorkDtos}
                    />
                  </div>
                </Card>
              )}
            </>
          )}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={assignTaskModal}
        toggle={() => setAssignTaskModal(!assignTaskModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setAssignTaskModal(!assignTaskModal)}>
          اساین کردن تسک
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data, event) => {
              event.preventDefault();
              const obj = {
                worktitle: data.worktitle,
                workDescribe: data.workDescribe,
                workDate: moment(data.workDate).format().slice(0, 10),
                assistanceId: assistanceId,
              };
              mutateAsync(obj);
            })}
          >
            <Row>
              <Col md="6" className="mb-1">
                <Label className="form-label" for="worktitle">
                  عنوان تسک
                </Label>
                <Controller
                  name="worktitle"
                  id="worktitle"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.worktitle?.message}
                </p>
              </Col>

              <Col md="6" className="mb-1">
                <Label className="form-label" for="workDate">
                  تاریخ شروع تسک
                </Label>
                <Controller
                  name="workDate"
                  id="workDate"
                  control={control}
                  render={({ field }) => <Input type="date" {...field} />}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.workDate?.message}
                </p>
              </Col>

              <Col className="mb-1 col-12">
                <Label className="form-label" for="workDescribe">
                  توضیحات تسک
                </Label>
                <Controller
                  name="workDescribe"
                  id="workDescribe"
                  control={control}
                  render={({ field }) => (
                    <Input
                      style={{ height: "100px" }}
                      type="textarea"
                      {...field}
                    />
                  )}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.workDescribe?.message}
                </p>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button type="submit" color="success" className="btn-submit">
                ثبت تسک
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default CourseAssistanceListTable;
