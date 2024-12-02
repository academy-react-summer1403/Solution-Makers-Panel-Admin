import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  editArticle,
  getArticleById,
  getNewsCategoriesList,
} from "../../../services/api/Articles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Col, Form, Input, Label, Row, Spinner } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import TextEditor from "../../Editor";
import toast from "react-hot-toast";
import ErrorComponent from "../../common/ErrorComponent";

const schema = yup.object().shape({
  Title: yup.string().required("عنوان مقاله را وارد کنید"),
  GoogleTitle: yup
    .string()
    .required("عنوان گوگل را وارد کنید")
    .min(50, "حداقل 50 حرف")
    .max(70, "حداکثر 70 حرف"),
  GoogleDescribe: yup
    .string()
    .required("توضیحات گوگل را وارد کنید")
    .min(70, "حداقل 70 حرف")
    .max(150, "حداکثر 150 حرف"),
  MiniDescribe: yup
    .string()
    .required("توضیحات کوتاه را وارد کنید")
    .min(10, "حداقل 10 حرف")
    .max(300, "حداکثر 300 حرف"),
  Describe: yup
    .string()
    .required("توضیحات کامل مقاله را وارد کنید")
    .min(50, "حداقل 50 حرف"),
  Keyword: yup.string().required("کلمات کلیدی را وارد کنید"),
  NewsCatregoryId: yup
    .object()
    .shape({
      value: yup.string().required("لطفا دسته بندی مقاله را انتخاب کنید"),
    })
    .nullable(),
});

function EditArticle() {
  const { articleId } = useParams();
  const queryClient = useQueryClient();

  const formData = new FormData();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Title: "",
      GoogleTitle: "",
      Keyword: "",
      NewsCatregoryId: {},
      MiniDescribe: "",
      GoogleDescribe: "",
      Describe: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    data: articleDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articleDetails", articleId],
    queryFn: () => getArticleById(articleId),
    refetchOnWindowFocus: false,
  });

  const { data: newsCategories, error: newsCategoriesError } = useQuery({
    queryKey: ["newsCategories"],
    queryFn: getNewsCategoriesList,
  });

  const { mutateAsync } = useMutation({
    mutationFn: editArticle,
    onSuccess: () => {
      toast.success("اطلاعات ثبت شد");
      queryClient.invalidateQueries("articleDetails");
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  useEffect(() => {
    if (articleDetails?.data) {
      setValue("Title", articleDetails.data.detailsNewsDto.title);
      setValue("GoogleTitle", articleDetails.data.detailsNewsDto.googleTitle);
      setValue("Keyword", articleDetails.data.detailsNewsDto.keyword);
      setValue("NewsCatregoryId", {
        value: articleDetails.data.detailsNewsDto.newsCatregoryId,
        label: articleDetails.data.detailsNewsDto.newsCatregoryName,
      });
      setValue("MiniDescribe", articleDetails.data.detailsNewsDto.miniDescribe);
      setValue(
        "GoogleDescribe",
        articleDetails.data.detailsNewsDto.googleDescribe
      );
      setValue("Describe", articleDetails.data.detailsNewsDto.describe);
    }
  }, [articleDetails?.data]);

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div className="bg-white p-2 rounded-2">
      <div className="content-header">
        <h5 className="mb-0">ویرایش مقاله</h5>
      </div>
      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          formData.append("Id", articleId);
          formData.append("Title", data.Title);
          formData.append("GoogleTitle", data.GoogleTitle);
          formData.append("GoogleDescribe", data.GoogleDescribe);
          formData.append("MiniDescribe", data.MiniDescribe);
          formData.append("Keyword", data.Keyword);
          formData.append("Describe", data.Describe);
          formData.append("NewsCatregoryId", data.NewsCatregoryId.value);
          formData.append("Active", true);
          if (
            !formData.get("Image") &&
            articleDetails.data.detailsNewsDto.currentImageAddress
          ) {
            formData.append(
              "CurrentImageAddress",
              articleDetails.data.detailsNewsDto.currentImageAddress
            );
          }
          mutateAsync(formData);
        })}
      >
        <Row className="mt-2">
          <Col md="6" className="mb-1">
            <Label className="form-label" for="Title">
              عنوان مقاله
            </Label>
            <Controller
              name="Title"
              id="Title"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.Title?.message}
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
            <Label className="form-label" for="Keyword">
              کلمات کلیدی
            </Label>
            <Controller
              name="Keyword"
              id="Keyword"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.Keyword?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="NewsCatregoryId">
              دسته بندی
            </Label>
            <Controller
              name="NewsCatregoryId"
              id="NewsCatregoryId"
              control={control}
              render={({ field }) =>
                newsCategoriesError ? (
                  <ErrorComponent />
                ) : (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={newsCategories?.data.map((item) => ({
                      value: item.id,
                      label: item.categoryName,
                    }))}
                  />
                )
              }
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.NewsCatregoryId?.value.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="MiniDescribe">
              توضیحات کوتاه
            </Label>
            <Controller
              name="MiniDescribe"
              id="MiniDescribe"
              control={control}
              render={({ field }) => <Input type="textarea" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.MiniDescribe?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="GoogleDescribe">
              توضیحات گوگل
            </Label>
            <Controller
              name="GoogleDescribe"
              id="GoogleDescribe"
              control={control}
              render={({ field }) => <Input type="textarea" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.GoogleDescribe?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label">ویرایش عکس</Label>
            <Input
              type="file"
              onChange={(e) => formData.append("Image", e.target.files[0])}
            />
          </Col>
        </Row>

        <Row className="mt-1">
          <Col className="mb-2">
            <Label className="form-label" for="Describe">
              توضیحات اصلی
            </Label>
            <Controller
              name="Describe"
              control={control}
              render={({ field }) => (
                <TextEditor
                  value={getValues("Describe")}
                  valueTitle="Describe"
                  setValue={setValue}
                  {...field}
                />
              )}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.Describe?.message}
            </p>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button type="submit" color="success" className="btn-submit">
            ثبت اطلاعات
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default EditArticle;
