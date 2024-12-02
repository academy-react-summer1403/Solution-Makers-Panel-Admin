import { useQuery } from "@tanstack/react-query";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getNewsCategoriesList } from "../../../services/api/Articles";
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
  Keyword: yup.string().required("کلمات کلیدی را وارد کنید"),
  NewsCatregoryId: yup
    .object()
    .shape({
      value: yup.string().required("لطفا دسته بندی مقاله را انتخاب کنید"),
    })
    .nullable(),
});

function ArticleDetails({ stepper, formData }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Title: "",
      GoogleTitle: "",
      GoogleDescribe: "",
      MiniDescribe: "",
      Keyword: "",
      NewsCatregoryId: { value: "", label: "لطفا انتخاب کنید" },
    },
    resolver: yupResolver(schema),
  });

  const { data, error } = useQuery({
    queryKey: ["newsCategories"],
    queryFn: getNewsCategoriesList,
  });

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">اطلاعات اولیه مقاله را وارد کنید</h5>
      </div>

      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          formData.append("Title", data.Title);
          formData.append("GoogleTitle", data.GoogleTitle);
          formData.append("GoogleDescribe", data.GoogleDescribe);
          formData.append("MiniDescribe", data.MiniDescribe);
          formData.append("Keyword", data.Keyword);
          formData.append("NewsCatregoryId", data.NewsCatregoryId.value);
          stepper.next();
        })}
      >
        <Row>
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
              render={({ field }) => (
                <Select
                  {...field}
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  options={data?.data.map((item) => ({
                    value: item.id,
                    label: item.categoryName,
                  }))}
                />
              )}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.NewsCatregoryId?.value.message}
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
              render={({ field }) => <Input type="textarea" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.GoogleDescribe?.message}
            </p>
          </Col>

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
        </Row>

        <div className="d-flex justify-content-between">
          <Button color="secondary" className="btn-prev" outline disabled>
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              بازگشت
            </span>
          </Button>
          <Button color="primary" className="btn-next" type="submit">
            <span className="align-middle d-sm-inline-block d-none">ادامه</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </>
  );
}

export default ArticleDetails;
