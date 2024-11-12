import { Label, Row, Col, Input, Form, Button } from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment/moment";

const schema = yup
  .object({
    Title: yup.string().required("نام دوره را وارد کنید"),
    Cost: yup
      .number()
      .transform((value) => (Number.isNaN(value) ? null : value))
      .nullable()
      .required("قیمت دوره را وارد کنید"),
    Capacity: yup
      .number()
      .transform((value) => (Number.isNaN(value) ? null : value))
      .nullable()
      .required("ظرفیت دوره را وارد کنید"),
    SessionNumber: yup
      .number()
      .transform((value) => (Number.isNaN(value) ? null : value))
      .nullable()
      .required("تعداد جلسات دوره را وارد کنید"),
    MiniDescribe: yup.string().required("توضیحات مختصر دوره را وارد کنید"),
    StartTime: yup
      .date()
      .typeError("لطفا یک تاریخ معتبر وارد کنید")
      .required("تاریخ شروع دوره را وارد کنید"),
    EndTime: yup
      .date()
      .typeError("لطفا یک تاریخ معتبر وارد کنید")
      .required("تاریخ پایان دوره را وارد کنید"),
    UniqueString: yup.string().required("کلمه یکتا دوره را وارد کنید"),
  })
  .required();

const CourseDetails = ({ stepper, formData }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      Title: "",
      Cost: "",
      Capacity: "",
      SessionNumber: "",
      MiniDescribe: "",
      StartTime: "",
      EndTime: "",
      UniqueString: "",
    },
  });

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">اطلاعات اولیه دوره را وارد کنید</h5>
      </div>
      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          formData.append("Title", data.Title);
          formData.append("Cost", data.Cost);
          formData.append("Capacity", data.Capacity);
          formData.append("SessionNumber", data.SessionNumber);
          formData.append("MiniDescribe", data.MiniDescribe);
          formData.append(
            "StartTime",
            moment(data.StartTime).format().slice(0, 10)
          );
          formData.append(
            "EndTime",
            moment(data.EndTime).format().slice(0, 10)
          );
          formData.append("UniqeUrlString", data.UniqueString);
        })}
      >
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="Title">
              نام دوره
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
            <Label className="form-label" for="Cost">
              قیمت دوره
            </Label>
            <Controller
              name="Cost"
              id="Cost"
              control={control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>{errors.Cost?.message}</p>
          </Col>
        </Row>

        <Row>
          <div className="form-password-toggle col-md-6 mb-1">
            <Label className="form-label" for="Capacity">
              ظرفیت دوره
            </Label>
            <Controller
              name="Capacity"
              id="Capacity"
              control={control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.Capacity?.message}
            </p>
          </div>
          <div className="form-password-toggle col-md-6 mb-1">
            <Label className="form-label" for="SessionNumber">
              تعداد جلسات
            </Label>
            <Controller
              name="SessionNumber"
              id="SessionNumber"
              control={control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.SessionNumber?.message}
            </p>
          </div>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="StartTime">
              تاریخ شروع
            </Label>
            <Controller
              name="StartTime"
              id="StartTime"
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.StartTime?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="EndTime">
              تاریخ پایان
            </Label>
            <Controller
              name="EndTime"
              id="EndTime"
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.EndTime?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="UniqueString">
              کلمه یکتا
            </Label>
            <Controller
              name="UniqueString"
              id="UniqueString"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.UniqueString?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="MiniDescribe">
              توضیحات مختصر
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
          <Button
            color="primary"
            className="btn-next"
            type="submit"
            onClick={() => {
              if (isValid) {
                stepper.next();
              }
            }}
          >
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
};

export default CourseDetails;
