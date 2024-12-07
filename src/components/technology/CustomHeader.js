import { useEffect } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTechnology,
  editTechnology,
  getTechnologyById,
} from "../../services/api/Technology";
import toast from "react-hot-toast";
import SearchComponent from "../common/SearchComponent";

const schema = yup.object({
  techName: yup.string().required("نام تکنولوژی را وارد کنید"),
  describe: yup.string().required("توضیحات را وارد کنید"),
  iconAddress: yup.string().required("آدرس آیکون را وارد کنید"),
});

function TechsListCustomHeader({
  editId,
  setEditId,
  createOrEditTechModal,
  setCreateOrEditTechModal,
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
      techName: "",
      describe: "",
      iconAddress: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    data: technology,
    error,
    refetch,
  } = useQuery({
    queryKey: ["techById"],
    queryFn: () => getTechnologyById(editId),
    enabled: false,
  });

  const { mutateAsync: createTechnologyMutate } = useMutation({
    mutationFn: createTechnology,
    onSuccess: () => {
      toast.success("تکنولوژی ساخته شد");
      queryClient.invalidateQueries("techsList");
      setCreateOrEditTechModal(!createOrEditTechModal);
      reset();
    },
  });

  const { mutateAsync: editTechnologyMutate } = useMutation({
    mutationFn: editTechnology,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      queryClient.invalidateQueries("techsList");
      setCreateOrEditTechModal(!createOrEditTechModal);
      reset();
    },
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (technology?.data && editId) {
      setValue("techName", technology.data.techName);
      setValue("describe", technology.data.describe);
      setValue("iconAddress", technology.data.iconAddress);
    } else {
      reset();
    }
  }, [technology?.data, editId]);

  useEffect(() => {
    if (!createOrEditTechModal) {
      setEditId("");
      reset();
    }
  }, [createOrEditTechModal]);

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
          onClick={() => setCreateOrEditTechModal(!createOrEditTechModal)}
        >
          ساخت تکنولوژی جدید
        </Button>
      </div>

      {editId && error ? (
        toast.error("خطا در دریافت اطلاعات")
      ) : (
        <Modal
          isOpen={createOrEditTechModal}
          toggle={() => setCreateOrEditTechModal(!createOrEditTechModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader
            toggle={() => setCreateOrEditTechModal(!createOrEditTechModal)}
          >
            {editId ? "ویرایش اطلاعات تکنولوژی" : "ساخت تکنولوژی جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const obj = {
                  techName: data.techName,
                  describe: data.describe,
                  iconAddress: data.iconAddress,
                };
                if (editId) {
                  const newObj = { ...obj, id: editId };
                  editTechnologyMutate(newObj);
                } else {
                  createTechnologyMutate(obj);
                }
              })}
            >
              <Row>
                <Col className="mb-1 col-12">
                  <Label className="form-label" for="techName">
                    نام تکنولوژی
                  </Label>
                  <Controller
                    name="techName"
                    id="techName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.techName?.message}
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
                  <Label className="form-label" for="iconAddress">
                    آدرس آیکون
                  </Label>
                  <Controller
                    name="iconAddress"
                    id="iconAddress"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.iconAddress?.message}
                  </p>
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button type="submit" color="success" className="btn-submit">
                  {editId ? "ویرایش اطلاعات" : "ایجاد تکنولوژی"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default TechsListCustomHeader;
