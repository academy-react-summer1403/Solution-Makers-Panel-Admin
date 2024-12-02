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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  createCourseLevel,
  editCourseLevel,
  getCourseLevelById,
} from "../../services/api/CourseLevel";

const schema = yup.object({
  levelName: yup.string().required("سطح دوره را وارد کنید"),
});

function CourseLevelListHeader({
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
      levelName: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    data: courseLevel,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courseLevelById"],
    queryFn: () => getCourseLevelById(editId),
    enabled: false,
  });

  const { mutateAsync: createCourseLevelMutate } = useMutation({
    mutationFn: createCourseLevel,
    onSuccess: () => {
      toast.success("سطح جدید ساخته شد");
      queryClient.invalidateQueries("courseLevelsList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  const { mutateAsync: editCourseLevelMutate } = useMutation({
    mutationFn: editCourseLevel,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      queryClient.invalidateQueries("courseLevelsList");
      setCreateOrEditModal(!createOrEditModal);
      reset();
    },
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (courseLevel?.data && editId) {
      setValue("levelName", courseLevel.data.levelName);
    } else {
      reset();
    }
  }, [courseLevel?.data, editId]);

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
          ساخت سطح جدید
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
            {editId ? "ویرایش اطلاعات سطح" : "ساخت سطح جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const obj = {
                  levelName: data.levelName,
                };
                if (editId) {
                  const newObj = { ...obj, id: editId };
                  editCourseLevelMutate(newObj);
                } else {
                  createCourseLevelMutate(obj);
                }
              })}
            >
              <Row>
                <Col className="mb-1 col-12">
                  <Label className="form-label" for="levelName">
                    نام سطح
                  </Label>
                  <Controller
                    name="levelName"
                    id="levelName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.levelName?.message}
                  </p>
                </Col>

                {/* <Col className="mb-1 col-12">
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
                </Col> */}
              </Row>

              <div className="d-flex justify-content-end">
                <Button type="submit" color="success" className="btn-submit">
                  {editId ? "ویرایش اطلاعات" : "ایجاد سطح"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default CourseLevelListHeader;
