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
import {
  createStatus,
  editStatus,
  getStatusById,
} from "../../services/api/Status";
import toast from "react-hot-toast";

const schema = yup.object({
  statusName: yup.string().required("نام وضعیت را وارد کنید"),
  describe: yup.string().required("توضیحات را وارد کنید"),
  statusNumber: yup.string().required("شماره وضعیت را وارد کنید"),
});

function StatusListCustomHeader({
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
      statusName: "",
      describe: "",
      statusNumber: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    data: status,
    error,
    refetch,
  } = useQuery({
    queryKey: ["statusById"],
    queryFn: () => getStatusById(editId),
    enabled: false,
  });

  const { mutateAsync: createStatusMutate } = useMutation({
    mutationFn: createStatus,
    onSuccess: () => {
      toast.success("وضعیت ساخته شد");
      queryClient.invalidateQueries("statusList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  const { mutateAsync: editStatusMutate } = useMutation({
    mutationFn: editStatus,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      queryClient.invalidateQueries("statusList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (status?.data && editId) {
      setValue("statusName", status.data.statusName);
      setValue("describe", status.data.describe);
      setValue("statusNumber", status.data.statusNumber);
    } else {
      reset();
    }
  }, [status?.data, editId]);

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
          ساخت وضعیت جدید
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
            {editId ? "ویرایش اطلاعات وضعیت" : "ساخت وضعیت جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const obj = {
                  statusName: data.statusName,
                  describe: data.describe,
                  statusNumber: data.statusNumber,
                };
                if (editId) {
                  const newObj = { ...obj, id: editId };
                  editStatusMutate(newObj);
                } else {
                  createStatusMutate(obj);
                }
              })}
            >
              <Row>
                <Col className="mb-1 col-12">
                  <Label className="form-label" for="statusName">
                    نام وضعیت
                  </Label>
                  <Controller
                    name="statusName"
                    id="statusName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.statusName?.message}
                  </p>
                </Col>

                <Col className="mb-1 col-12">
                  <Label className="form-label" for="describe">
                    توضیحات
                  </Label>
                  <Controller
                    name="describe"
                    id="describe"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.describe?.message}
                  </p>
                </Col>

                <Col className="mb-1 col-12">
                  <Label className="form-label" for="statusNumber">
                    شماره وضعیت
                  </Label>
                  <Controller
                    name="statusNumber"
                    id="statusNumber"
                    control={control}
                    render={({ field }) => <Input type="number" {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.statusNumber?.message}
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
      )}
    </>
  );
}

export default StatusListCustomHeader;
