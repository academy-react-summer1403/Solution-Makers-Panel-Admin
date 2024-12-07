import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import Select from "react-select";
import { addTerm, getTermById, updateTerm } from "../../services/api/Term";
import { getAllDepartments } from "../../services/api/Department";
import moment from "moment";
import SearchComponent from "../common/SearchComponent";

const schema = yup.object().shape({
  termName: yup.string().required("نام ترم را وارد کنید"),
  startDate: yup
    .date()
    .typeError("لطفا یک تاریخ معتبر وارد کنید")
    .required("تاریخ شروع ترم را وارد کنید"),
  endDate: yup
    .date()
    .typeError("لطفا یک تاریخ معتبر وارد کنید")
    .required("تاریخ پایان ترم را وارد کنید"),
  departmentId: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required("لطفا دپارتمان را انتخاب کنید"),
    })
    .nullable()
    .required("لطفا ساختمان کلاس را انتخاب کنید"),
});

function TermsListCustomHeader({
  editId,
  setEditId,
  createOrEditModal,
  setCreateOrEditModal,
  searchTerm,
  setSearchTerm,
}) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      termName: "",
      startDate: "",
      endDate: "",
      departmentId: { value: "", label: "لطفا انتخاب کنید" },
    },
    resolver: yupResolver(schema),
  });

  const {
    data: term,
    error,
    refetch,
  } = useQuery({
    queryKey: ["termById"],
    queryFn: () => getTermById(editId),
    enabled: false,
  });

  const { data } = useQuery({
    queryKey: ["departmentList"],
    queryFn: getAllDepartments,
  });

  const { mutateAsync: addTermMutate } = useMutation({
    mutationFn: addTerm,
    onSuccess: () => {
      toast.success("ترم اضافه شد");
      queryClient.invalidateQueries("termsList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  const { mutateAsync: updateTermMutate } = useMutation({
    mutationFn: updateTerm,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      queryClient.invalidateQueries("termsList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (term?.data && data?.data && editId) {
      setValue("termName", term.data.termName);
      setValue(
        "departmentId",
        data.data
          .map((item) => ({
            value: item.id,
            label: item.depName,
          }))
          .find((item) => item.label == term.data.departmentName)
      );
      setValue("startDate", term.data.startDate.slice(0, 10));
      setValue("endDate", term.data.endDate.slice(0, 10));
    } else {
      reset();
    }
  }, [term?.data, data?.data, editId]);

  useEffect(() => {
    if (!createOrEditModal) {
      setEditId("");
      reset();
    }
  }, [createOrEditModal]);

  return (
    <>
      <div className="invoice-list-table-header w-100 d-flex align-items-center justify-content-between">
        <SearchComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          width="30"
        />
        <Button
          color="primary"
          onClick={() => setCreateOrEditModal(!createOrEditModal)}
        >
          افزودن ترم جدید
        </Button>
      </div>

      {editId && error ? (
        toast.error("خطا در دریافت اطلاعات")
      ) : (
        <Modal
          isOpen={createOrEditModal}
          toggle={() => setCreateOrEditModal(!createOrEditModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setCreateOrEditModal(!createOrEditModal)}>
            {editId ? "ویرایش اطلاعات ترم" : "افزودن ترم جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const obj = {
                  termName: data.termName,
                  departmentId: data.departmentId.value,
                  startDate: moment(data.startDate).format().slice(0, 10),
                  endDate: moment(data.endDate).format().slice(0, 10),
                };
                if (editId) {
                  const newObj = {
                    ...obj,
                    id: editId,
                    expire: event.target.expire.value == "true" ? true : false,
                  };
                  updateTermMutate(newObj);
                } else {
                  addTermMutate(obj);
                }
              })}
            >
              <Row>
                <Col className="mb-1 col-6">
                  <Label className="form-label" for="termName">
                    نام ترم
                  </Label>
                  <Controller
                    name="termName"
                    id="termName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.termName?.message}
                  </p>
                </Col>

                <Col className="mb-1 col-6">
                  <Label className="form-label" for="departmentId">
                    دپارتمان
                  </Label>
                  <Controller
                    name="departmentId"
                    id="departmentId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        theme={selectThemeColors}
                        isClearable={false}
                        className="react-select"
                        classNamePrefix="select"
                        options={data?.data.map((item) => ({
                          value: item.id,
                          label: item.depName,
                        }))}
                      />
                    )}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.departmentId?.value.message ||
                      errors.departmentId?.label.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="startDate">
                    تاریخ شروع ترم
                  </Label>
                  <Controller
                    name="startDate"
                    id="startDate"
                    control={control}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.startDate?.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="endDate">
                    تاریخ پایان ترم
                  </Label>
                  <Controller
                    name="endDate"
                    id="endDate"
                    control={control}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.endDate?.message}
                  </p>
                </Col>

                {editId && (
                  <Col md="6" className="mb-1">
                    <div className="demo-inline-spacing">
                      <div className="form-check">
                        <Input
                          type="radio"
                          id="ex1-inactive"
                          name="expire"
                          value={false}
                          defaultChecked
                        />
                        <Label className="form-check-label" for="ex1-inactive">
                          فعال کردن
                        </Label>
                      </div>
                      <div className="form-check">
                        <Input
                          type="radio"
                          id="ex1-active"
                          name="expire"
                          value={true}
                        />
                        <Label className="form-check-label" for="ex1-active">
                          منقضی کردن
                        </Label>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              <div className="d-flex justify-content-end">
                <Button type="submit" color="success" className="btn-submit">
                  {editId ? "ویرایش اطلاعات" : "افزودن ترم"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default TermsListCustomHeader;
