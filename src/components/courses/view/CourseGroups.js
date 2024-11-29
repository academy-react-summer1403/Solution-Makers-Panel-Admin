import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  UncontrolledDropdown,
} from "reactstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Edit2, MoreHorizontal, Trash } from "react-feather";
import { showApplyChangesSwal } from "../../../utility/Utils";
import toast from "react-hot-toast";
import {
  createNewCourseGroup,
  deleteCourseGroup,
  editCourseGroup,
  getCourseGroups,
} from "../../../services/api/Courses";

const schema = yup
  .object({
    groupName: yup
      .string()
      .required("نام گروه را وارد کنید")
      .min(2, "حداقل 2 حرف")
      .max(20, "حداکثر 20 حرف"),
    groupCapacity: yup
      .number()
      .transform((value) => (Number.isNaN(value) ? null : value))
      .nullable()
      .required("ظرفیت گروه را وارد کنید")
      .min(1, "حداقل 1 نفر")
      .max(254, "حداکثر 254 نفر"),
  })
  .required();

const CourseGroups = () => {
  const { courseId } = useParams();
  const [formModal, setFormModal] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      groupName: "",
      groupCapacity: "",
      groupId: "",
    },
  });

  const queryClient = useQueryClient();

  const courseDetails = queryClient.getQueryData(["courseDetails", courseId]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseGroups"],
    queryFn: () => getCourseGroups(courseDetails?.data.teacherId, courseId),
    enabled: false,
  });

  const { mutateAsync: deleteCourseGroupMutate } = useMutation({
    mutationFn: deleteCourseGroup,
    onSuccess: () => refetch().then(() => toast.success("گروه حذف شد")),
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const { mutateAsync: addNewGroupMutate } = useMutation({
    mutationFn: createNewCourseGroup,
    onSuccess: () => refetch().then(() => toast.success("گروه جدید ساخته شد")),
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const { mutateAsync: editCourseGroupMutate } = useMutation({
    mutationFn: editCourseGroup,
    onSuccess: () => refetch().then(() => toast.success("گروه ویرایش شد")),
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  useEffect(() => {
    if (courseDetails) {
      refetch();
    }
  }, [courseDetails]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setFormModal(!formModal);
    }
  }, [isSubmitSuccessful]);

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
                  setValue("groupName", row.groupName);
                  setValue("groupCapacity", row.groupCapacity);
                  setValue("groupId", row.groupId);
                  setFormModal(!formModal);
                }}
              >
                <Edit2 size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
              <DropdownItem
                tag="span"
                className="w-100"
                onClick={() =>
                  showApplyChangesSwal(() =>
                    deleteCourseGroupMutate(row.groupId)
                  )
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
    return <span>loading data ....</span>
  }

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>
  }

  return (
    <>
      <div className="d-flex justify-content-end py-1">
        <Button
          color="primary"
          onClick={() => {
            reset();
            setFormModal(!formModal);
          }}
        >
          ساخت گروه
        </Button>
        <Modal
          isOpen={formModal}
          toggle={() => setFormModal(!formModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setFormModal(!formModal)}>
            <span style={{ fontSize: 20 }}>
              لطفا اطلاعات گروه را وارد نمایید
            </span>
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data) => {
                if (getValues("groupId")) {
                  const formData = new FormData();
                  formData.append("Id", getValues("groupId"));
                  formData.append("GroupName", data.groupName);
                  formData.append("CourseId", courseId);
                  formData.append("GroupCapacity", data.groupCapacity);
                  editCourseGroupMutate(formData);
                } else {
                  const formData = new FormData();
                  formData.append("GroupName", data.groupName);
                  formData.append("CourseId", courseId);
                  formData.append("GroupCapacity", data.groupCapacity);
                  addNewGroupMutate(formData);
                }
              })}
            >
              <div className="mb-2">
                <Controller
                  name="groupName"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="نام گروه" />
                  )}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.groupName?.message}
                </p>
              </div>
              <div className="mb-2">
                <Controller
                  name="groupCapacity"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      {...field}
                      placeholder="ظرفیت گروه (حداکثر 254 نفر)"
                    />
                  )}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.groupCapacity?.message}
                </p>
              </div>
              <Button color="primary" type="submit">
                {!getValues("groupId") ? "افزودن گروه" : "ثبت تغییرات"}
              </Button>
            </Form>
          </ModalBody>
        </Modal>
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

export default CourseGroups;
