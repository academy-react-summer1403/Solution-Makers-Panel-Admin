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
import toast from "react-hot-toast";
import {
  addBuilding,
  getBuildingById,
  updateBuilding,
} from "../../services/api/Building";
import moment from "moment";
import SearchComponent from "../common/SearchComponent";

const schema = yup.object({
  buildingName: yup.string().required("نام ساختمان را وارد کنید"),
  floor: yup.string().required("شماره طبقه را وارد کنید"),
  latitude: yup.string().required("عرض جغرافیایی را وارد کنید"),
  longitude: yup.string().required("طول جغرافیایی را وارد کنید"),
  workDate: yup
    .date()
    .typeError("لطفا یک تاریخ معتبر وارد کنید")
    .required("تاریخ شروع به کار را وارد کنید"),
});

function BuildingListCustomHeader({
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
      buildingName: "",
      workDate: "",
      floor: "",
      latitude: "",
      longitude: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    data: building,
    error,
    refetch,
  } = useQuery({
    queryKey: ["buildingById"],
    queryFn: () => getBuildingById(editId),
    enabled: false,
  });

  const { mutateAsync: addBuildingMutate } = useMutation({
    mutationFn: addBuilding,
    onSuccess: () => {
      toast.success("ساختمان اضافه شد");
      queryClient.invalidateQueries("buildingsList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  const { mutateAsync: updateBuildingMutate } = useMutation({
    mutationFn: updateBuilding,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      queryClient.invalidateQueries("buildingsList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (building?.data && editId) {
      setValue("buildingName", building.data.buildingName);
      setValue("floor", building.data.floor);
      setValue("workDate", building.data.workDate.slice(0, 10));
      setValue("latitude", building.data.latitude);
      setValue("longitude", building.data.longitude);
    } else {
      reset();
    }
  }, [building?.data, editId]);

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
          افزودن ساختمان جدید
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
            {editId ? "ویرایش اطلاعات ساختمان" : "افزودن ساختمان جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const obj = {
                  buildingName: data.buildingName,
                  floor: data.floor,
                  workDate: moment(data.workDate).format().slice(0, 10),
                  latitude: data.latitude,
                  longitude: data.longitude,
                };
                if (editId) {
                  const newObj = { ...obj, id: editId, active: true };
                  updateBuildingMutate(newObj);
                } else {
                  addBuildingMutate(obj);
                }
              })}
            >
              <Row>
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="buildingName">
                    نام ساختمان
                  </Label>
                  <Controller
                    name="buildingName"
                    id="buildingName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.buildingName?.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="floor">
                    شماره طبقه
                  </Label>
                  <Controller
                    name="floor"
                    id="floor"
                    control={control}
                    render={({ field }) => <Input type="number" {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.floor?.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="workDate">
                    تاریخ شروع به کار
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

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="latitude">
                    عرض جغرافیایی
                  </Label>
                  <Controller
                    name="latitude"
                    id="latitude"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.latitude?.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="longitude">
                    طول جغرافیایی
                  </Label>
                  <Controller
                    name="longitude"
                    id="longitude"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.longitude?.message}
                  </p>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button type="submit" color="success" className="btn-submit">
                  {editId ? "ویرایش اطلاعات" : "افزودن ساختمان"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default BuildingListCustomHeader;
