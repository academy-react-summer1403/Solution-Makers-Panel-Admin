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
import {
  createDepartment,
  getDepartmentById,
  updateDepartment,
} from "../../services/api/Department";
import { getAllBuildings } from "../../services/api/Building";
import SearchComponent from "../common/SearchComponent";

const schema = yup.object().shape({
  depName: yup.string().required("نام دپارتمان را وارد کنید"),
  buildingId: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required("لطفا ساختمان کلاس را انتخاب کنید"),
    })
    .nullable()
    .required("لطفا ساختمان کلاس را انتخاب کنید"),
});

function DepartmentListCustomHeader({
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
      depName: "",
      buildingId: { value: "", label: "لطفا انتخاب کنید" },
    },
    resolver: yupResolver(schema),
  });

  const {
    data: department,
    error,
    refetch,
  } = useQuery({
    queryKey: ["departmentById"],
    queryFn: () => getDepartmentById(editId),
    enabled: false,
  });

  const { data } = useQuery({
    queryKey: ["buildingsList"],
    queryFn: getAllBuildings,
  });

  const { mutateAsync: createDepartmentMutate } = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      toast.success("دپارتمان اضافه شد");
      queryClient.invalidateQueries("departmentList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  const { mutateAsync: updateDepartmentMutate } = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      queryClient.invalidateQueries("departmentList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (department?.data && data?.data && editId) {
      setValue("depName", department.data.depName);
      setValue(
        "buildingId",
        data.data
          .map((item) => ({
            value: item.id,
            label: item.buildingName,
          }))
          .find((item) => item.label == department.data.buildingName)
      );
    } else {
      reset();
    }
  }, [department?.data, data?.data, editId]);

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
          افزودن دپارتمان جدید
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
            {editId ? "ویرایش اطلاعات دپارتمان" : "افزودن دپارتمان جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const obj = {
                  depName: data.depName,
                  buildingId: data.buildingId.value,
                };
                if (editId) {
                  const newObj = { ...obj, id: editId };
                  updateDepartmentMutate(newObj);
                } else {
                  createDepartmentMutate(obj);
                }
              })}
            >
              <Row>
                <Col className="mb-1 col-6">
                  <Label className="form-label" for="depName">
                    نام دپارتمان
                  </Label>
                  <Controller
                    name="depName"
                    id="depName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.depName?.message}
                  </p>
                </Col>

                <Col className="mb-1 col-6">
                  <Label className="form-label" for="buildingId">
                    ساختمان کلاس
                  </Label>
                  <Controller
                    name="buildingId"
                    id="buildingId"
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
                          label: item.buildingName,
                        }))}
                      />
                    )}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.buildingId?.value.message ||
                      errors.buildingId?.label.message}
                  </p>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button type="submit" color="success" className="btn-submit">
                  {editId ? "ویرایش اطلاعات" : "افزودن دپارتمان"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default DepartmentListCustomHeader;
