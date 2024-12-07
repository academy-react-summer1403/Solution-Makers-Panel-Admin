import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { Edit2, MoreHorizontal } from "react-feather";
import ErrorComponent from "../common/ErrorComponent";
import DataTable from "react-data-table-component";
import {
  getAllAssistanceWork,
  updateAssistanceWork,
} from "../../services/api/Assistance";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";
import toast from "react-hot-toast";
import SearchComponent from "../common/SearchComponent";

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
    .required("تاریخ شروع دوره را وارد کنید"),
});

function AssistanceWorkListTable() {
  const [editId, setEditId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [assistanceId, setAssistanceId] = useState("");
  const [createOrEditModal, setCreateOrEditModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["assistanceWorksList"],
    queryFn: getAllAssistanceWork,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateAssistanceWork,
    onSuccess: () => {
      queryClient.invalidateQueries("assistanceWorksList");
      toast.success("اطلاعات ویرایش شد");
      setCreateOrEditModal(!createOrEditModal);
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  const {
    control,
    handleSubmit,
    setValue,
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

  const columns = [
    {
      name: "نام پشتیبان",
      center: true,
      selector: (row) => row.assistanceName,
    },
    {
      name: "دوره پشتیبانی",
      center: true,
      selector: (row) => row.courseName,
    },
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
      name: "تاریخ شروع تسک",
      center: true,
      selector: (row) => row.workDate.slice(0, 10),
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
                  setAssistanceId(row.id);
                  setEditId(row.workId);
                  setValue("worktitle", row.worktitle);
                  setValue("workDescribe", row.workDescribe);
                  setValue("workDate", row.workDate.slice(0, 10));
                  setCreateOrEditModal(!createOrEditModal);
                }}
              >
                <Edit2 size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <SearchComponent
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        width="30"
      />
      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            responsive
            columns={columns}
            className="react-dataTable"
            data={data?.data.filter((item) => {
              if (!searchTerm) {
                return item;
              } else {
                const pattern = new RegExp(`${searchTerm}`, "i");
                return pattern.test(item.assistanceName);
              }
            })}
          />
        </div>
      </Card>

      <Modal
        isOpen={createOrEditModal}
        toggle={() => setCreateOrEditModal(!createOrEditModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setCreateOrEditModal(!createOrEditModal)}>
          {editId ? "ویرایش اطلاعات وضعیت" : "ساخت وضعیت جدید"}
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
                id: editId,
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
                {editId ? "ویرایش اطلاعات" : "ایجاد وضعیت"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default AssistanceWorkListTable;
