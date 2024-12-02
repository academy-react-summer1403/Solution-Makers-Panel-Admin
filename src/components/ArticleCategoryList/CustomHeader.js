import { Controller, useForm } from "react-hook-form";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewCategory,
  editCategory,
  getCategoryWithId,
} from "../../services/api/Articles";
import toast from "react-hot-toast";
import { useEffect } from "react";

const schema = yup
  .object({
    CategoryName: yup.string().required("عنوان دسته بندی را وارد کنید"),
    IconName: yup.string(),
    IconAddress: yup.string(),
    GoogleTitle: yup
      .string()
      .required("عنوان گوگل را وارد کنید")
      .min(40, "حداقل 40 حرف")
      .max(70, "حداکثر 70 حرف"),
    GoogleDescribe: yup
      .string()
      .required("توضیحات گوگل را وارد کنید")
      .min(70, "حداقل 70 حرف")
      .max(150, "حداکثر 150 حرف"),
  })
  .required();

function ArticleCategoryListTableHeader({
  editId,
  setEditId,
  createOrEditCategoryModal,
  setCreateOrEditCategoryModal,
}) {
  const formData = new FormData();

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      CategoryName: "",
      IconName: "",
      IconAddress: "",
      GoogleTitle: "",
      GoogleDescribe: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutateAsync: createNewCategoryMutate } = useMutation({
    mutationFn: createNewCategory,
    onSuccess: () => {
      toast.success("دسته بندی جدید ساخته شد");
      setCreateOrEditCategoryModal(!createOrEditCategoryModal);
      reset();
      queryClient.invalidateQueries("newsCategories");
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  const { mutateAsync: editCategoryMutate } = useMutation({
    mutationFn: editCategory,
    onSuccess: () => {
      toast.success("اطلاعات ویرایش شد");
      setCreateOrEditCategoryModal(!createOrEditCategoryModal);
      reset();
      queryClient.invalidateQueries("newsCategories");
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  const {
    data: category,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categoryWithId"],
    queryFn: () => getCategoryWithId(editId),
    enabled: false,
  });

  useEffect(() => {
    if (editId) {
      refetch();
    }
    if (category?.data && editId) {
      setValue("CategoryName", category.data.categoryName);
      setValue("GoogleTitle", category.data.googleTitle);
      setValue("GoogleDescribe", category.data.googleDescribe);
      category.data.iconName && setValue("IconName", category.data.iconName);
      category.data.iconAddress &&
        setValue("IconAddress", category.data.iconAddress);
    } else {
      reset();
    }
  }, [category?.data, editId]);

  useEffect(() => {
    if (!createOrEditCategoryModal) {
      setEditId("");
    }
  }, [createOrEditCategoryModal]);

  return (
    <>
      <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75 d-flex justify-content-end">
        <Button
          color="primary"
          onClick={() =>
            setCreateOrEditCategoryModal(!createOrEditCategoryModal)
          }
        >
          ساخت دسته بندی جدید
        </Button>
      </div>

      {editId && error ? (
        toast.error("خطا در دریافت اطلاعات")
      ) : (
        <Modal
          isOpen={createOrEditCategoryModal}
          toggle={() =>
            setCreateOrEditCategoryModal(!createOrEditCategoryModal)
          }
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader
            toggle={() =>
              setCreateOrEditCategoryModal(!createOrEditCategoryModal)
            }
          >
            {editId ? "ویرایش اطلاعات دسته بندی" : "ساخت دسته بندی جدید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                formData.append("CategoryName", data.CategoryName);
                formData.append("IconName", data.IconName);
                formData.append("IconAddress", data.IconAddress);
                formData.append("GoogleTitle", data.GoogleTitle);
                formData.append("GoogleDescribe", data.GoogleDescribe);
                if (editId) {
                  formData.append("Id", editId);
                  editCategoryMutate(formData);
                } else {
                  createNewCategoryMutate(formData);
                }
              })}
            >
              <Row>
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="CategoryName">
                    عنوان دسته بندی
                  </Label>
                  <Controller
                    name="CategoryName"
                    id="CategoryName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.CategoryName?.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="IconName">
                    نام آیکون (اختیاری)
                  </Label>
                  <Controller
                    name="IconName"
                    id="IconName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.IconName?.message}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="IconAddress">
                    آدرس آیکون (اختیاری)
                  </Label>
                  <Controller
                    name="IconAddress"
                    id="IconAddress"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.IconAddress?.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label" for="GoogleTitle">
                    عنوان گوگل
                  </Label>
                  <Controller
                    name="GoogleTitle"
                    id="GoogleTitle"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.GoogleTitle?.message}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col md="6" className="mb-1">
                  <Label className="form-label" for="GoogleDescribe">
                    توضیحات گوگل
                  </Label>
                  <Controller
                    name="GoogleDescribe"
                    id="GoogleDescribe"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  <p style={{ color: "red", marginTop: 5 }}>
                    {errors.GoogleDescribe?.message}
                  </p>
                </Col>

                <Col md="6" className="mb-1">
                  <Label className="form-label">انتخاب تصویر (اختیاری)</Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      formData.append("Image", e.target.files[0])
                    }
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button type="submit" color="success" className="btn-submit">
                  {editId ? "ویرایش اطلاعات" : "ایجاد دسته بندی"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default ArticleCategoryListTableHeader;
