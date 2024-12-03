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
  addClassRoom,
  getClassRoomById,
  updateClassRoom,
} from "../../services/api/ClassRoom";
import { getAllBuildings } from "../../services/api/Building";

const schema = yup.object().shape({
  classRoomName: yup.string().required("نام کلاس را وارد کنید"),
  capacity: yup.string().required("ظرفیت کلاس را وارد کنید"),
  buildingId: yup
    .object()
    .shape({
      label: yup.string().required(),
      value: yup.string().required("لطفا ساختمان کلاس را انتخاب کنید"),
    })
    .nullable()
    .required("لطفا ساختمان کلاس را انتخاب کنید"),
});

function ClassRoomsListTableHeader({
  editId,
  setEditId,
  createOrEditModal,
  setCreateOrEditModal,
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
      classRoomName: "",
      capacity: "",
      buildingId: { value: "", label: "لطفا انتخاب کنید" },
    },
    resolver: yupResolver(schema),
  });

  const {
    data: classRoom,
    error,
    refetch,
  } = useQuery({
    queryKey: ["classRoomById"],
    queryFn: () => getClassRoomById(editId),
    enabled: false,
  });

  const { data } = useQuery({
    queryKey: ["buildingsList"],
    queryFn: getAllBuildings,
  });

  const { mutateAsync: addClassRoomMutate } = useMutation({
    mutationFn: addClassRoom,
    onSuccess: () => {
      toast.success("کلاس اضافه شد");
      queryClient.invalidateQueries("classList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  const { mutateAsync: updateClassRoomMutate } = useMutation({
    mutationFn: updateClassRoom,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      queryClient.invalidateQueries("classList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (classRoom?.data && data?.data && editId) {
      setValue("classRoomName", classRoom.data.classRoomName);
      setValue("capacity", classRoom.data.capacity);
      setValue(
        "buildingId",
        data.data
          .map((item) => ({
            value: item.id,
            label: item.buildingName,
          }))
          .find((item) => item.label == classRoom.data.buildingName)
      );
    } else {
      reset();
    }
  }, [classRoom?.data, data?.data, editId]);

  useEffect(() => {
    if (!createOrEditModal) {
      setEditId("");
      reset();
    }
  }, [createOrEditModal]);

  return (
    <>
      <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75 d-flex justify-content-end">
        <Button
          color="primary"
          onClick={() => setCreateOrEditModal(!createOrEditModal)}
        >
          افزودن کلاس جدید
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
            {editId ? "ویرایش اطلاعات کلاس" : "افزودن کلاس جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const obj = {
                  classRoomName: data.classRoomName,
                  capacity: data.capacity,
                  buildingId: data.buildingId.value,
                };
                if (editId) {
                  const newObj = { ...obj, id: editId };
                  updateClassRoomMutate(newObj);
                } else {
                  addClassRoomMutate(obj);
                }
              })}
            >
              <Row>
                <Col className="mb-1 col-6">
                  <Label className="form-label" for="classRoomName">
                    نام کلاس
                  </Label>
                  <Controller
                    name="classRoomName"
                    id="classRoomName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.classRoomName?.message}
                  </p>
                </Col>

                <Col className="mb-1 col-6">
                  <Label className="form-label" for="capacity">
                    ظرفیت
                  </Label>
                  <Controller
                    name="capacity"
                    id="capacity"
                    control={control}
                    render={({ field }) => <Input type="number" {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.capacity?.message}
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
                  {editId ? "ویرایش اطلاعات" : "افزودن کلاس"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default ClassRoomsListTableHeader;
