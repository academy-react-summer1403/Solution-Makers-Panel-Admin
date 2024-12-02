import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { Label, Row, Col, Input, Form, Button } from "reactstrap";
import { useEffect } from "react";
import moment from "moment/moment";
import TextEditor from "../../../Editor";
import { getCourseByIdUser } from "../../../../services/api/Courses";

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
    SessionNumber: yup.string().required("تعداد جلسات دوره را وارد کنید"),
    MiniDescribe: yup
      .string()
      .required("توضیحات مختصر دوره را وارد کنید")
      .min(15, "حداقل 15 حرف"),
    Describe: yup
      .string()
      .required("توضیحات کامل دوره را وارد کنید")
      .min(30, "حداقل 30 حرف"),
    StartTime: yup.string().required("تاریخ شروع دوره را وارد کنید"),
    EndTime: yup.string().required("تاریخ پایان دوره را وارد کنید"),
    UniqueString: yup.string().required("کلمه یکتا دوره را وارد کنید"),
  })
  .required();

const EditCourseDetails = ({ stepper, formData }) => {
  const { courseId } = useParams();

  const queryClient = useQueryClient();

  const courseDetails = queryClient.getQueryData(["courseDetails", courseId]);

  const { data, error } = useQuery({
    queryKey: ["courseDetailsUser", courseId],
    queryFn: () => getCourseByIdUser(courseId),
    refetchOnWindowFocus: false,
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      Title: "",
      Cost: "",
      Capacity: "",
      SessionNumber: "",
      Describe: "",
      MiniDescribe: "",
      StartTime: "",
      EndTime: "",
      UniqueString: "",
    },
  });

  useEffect(() => {
    if (courseDetails?.data) {
      setValue("Title", courseDetails.data.title);
      setValue("Cost", courseDetails.data.cost);
      setValue("Describe", courseDetails.data.describe);
      setValue("StartTime", courseDetails.data.startTime.slice(0, 10));
      setValue("EndTime", courseDetails.data.endTime.slice(0, 10));
    }
  }, [courseDetails]);

  useEffect(() => {
    if (data?.data) {
      setValue("Capacity", data.data.capacity);
      setValue("MiniDescribe", data.data.miniDescribe);
      setValue("UniqueString", data.data.uniqeUrlString);
    }
  }, [data]);

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>;
  }

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">اطلاعات اولیه دوره را وارد کنید</h5>
      </div>
      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          formData.append("Id", courseId);
          formData.append("Title", data.Title);
          formData.append("Cost", data.Cost);
          formData.append("Capacity", data.Capacity);
          formData.append("SessionNumber", data.SessionNumber);
          formData.append("Describe", data.Describe);
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
          stepper.next();
        })}
      >
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`Title`}>
              نام دوره
            </Label>
            <Controller
              name={`Title`}
              id={`Title`}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.Title?.message}
            </p>
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`Cost`}>
              قیمت دوره
            </Label>
            <Controller
              name={`Cost`}
              id={`Cost`}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>{errors.Cost?.message}</p>
          </Col>
        </Row>

        <Row>
          <div className="form-password-toggle col-md-6 mb-1">
            <Label className="form-label" for={`Capacity`}>
              ظرفیت دوره
            </Label>
            <Controller
              name={`Capacity`}
              id={`Capacity`}
              control={control}
              render={({ field }) => <Input type="number" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.Capacity?.message}
            </p>
          </div>
          <div className="form-password-toggle col-md-6 mb-1">
            <Label className="form-label" for={`SessionNumber`}>
              تعداد جلسات
            </Label>
            <Controller
              name={`SessionNumber`}
              id={`SessionNumber`}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.SessionNumber?.message}
            </p>
          </div>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`StartTime`}>
              تاریخ شروع
            </Label>
            <Controller
              name={`StartTime`}
              id={`StartTime`}
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.StartTime?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for={`EndTime`}>
              تاریخ پایان
            </Label>
            <Controller
              name={`EndTime`}
              id={`EndTime`}
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.EndTime?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for={`UniqueString`}>
              کلمه یکتا
            </Label>
            <Controller
              name={`UniqueString`}
              id={`UniqueString`}
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.UniqueString?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for={`MiniDescribe`}>
              توضیحات مختصر
            </Label>
            <Controller
              name={`MiniDescribe`}
              id={`MiniDescribe`}
              control={control}
              render={({ field }) => (
                <Input type="textarea" style={{ height: "100px" }} {...field} />
              )}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.MiniDescribe?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col className="mb-2">
            <Label className="form-label" for={`Describe`}>
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
            <span className="align-middle d-sm-inline-block d-none">بعدی</span>
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

export default EditCourseDetails;
