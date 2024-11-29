import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Label, Row, Col, Input, Form, Button } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, ArrowRight } from "react-feather";
import moment from "moment";
import { getUserById } from "../../../../services/api/Users";

const schema = yup.object({
  fName: yup.string().required("نام الزامیست").min(2, "حداقل 2 حرف"),
  lName: yup.string().required("نام خانوادگی الزامیست").min(2, "حداقل 2 حرف"),
  userName: yup.string().required("نام کاربری الزامیست").min(2, "حداقل 2 حرف"),
  nationalCode: yup
    .string()
    .required("کد ملی الزامیست")
    .matches(/^[0-9]{10}$/, { message: "لطفا یک کد ملی معتبر وارد کنید" }),
  birthDay: yup
    .date()
    .typeError("لطفا یک تاریخ معتبر وارد کنید")
    .required("تاریخ تولد کاربر را وارد کنید"),
  insertDate: yup
    .date()
    .typeError("لطفا یک تاریخ معتبر وارد کنید")
    .required("تاریخ ایجاد حساب کاربری را وارد کنید"),
  userAbout: yup
    .string()
    .required("درباره کاربر الزامیست")
    .min(10, "حداقل 10 حرف"),
  homeAdderess: yup
    .string()
    .required("آدرس کاربر الزامیست")
    .min(2, "حداقل 2 حرف"),
});

function EditUserInfos({ stepper, setUserData }) {
  const { userId } = useParams();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      fName: "",
      lName: "",
      userName: "",
      nationalCode: "",
      birthDay: "",
      insertDate: "",
      userAbout: "",
      homeAdderess: "",
    },
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(userId),
  });

  useEffect(() => {
    if (data?.data) {
      data.data.fName && setValue("fName", data.data.fName);
      data.data.lName && setValue("lName", data.data.lName);
      data.data.userName && setValue("userName", data.data.userName);
      data.data.nationalCode &&
        setValue("nationalCode", data.data.nationalCode);
      setValue("birthDay", data.data.birthDay.slice(0, 10));
      setValue("insertDate", data.data.insertDate.slice(0, 10));
      data.data.userAbout && setValue("userAbout", data.data.userAbout);
      data.data.homeAdderess &&
        setValue("homeAdderess", data.data.homeAdderess);
    }
  }, [data]);

  if (isLoading) {
    return <p>loading data ...</p>;
  }

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">ویرایش اطلاعات کاربر</h5>
      </div>

      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          setUserData({
            ...data,
            id: userId,
            birthDay: moment(data.birthDay).format().slice(0, 10),
            insertDate : moment(data.insertDate).format().slice(0, 10),
          });
          stepper.next();
        })}
      >
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="fName">
              نام
            </Label>
            <Controller
              name="fName"
              id="fName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.fName?.message}
            </p>
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="lName">
              نام خانوادگی
            </Label>
            <Controller
              name="lName"
              id="lName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.lName?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="userName">
              نام کاربری
            </Label>
            <Controller
              name="userName"
              id="userName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.userName?.message}
            </p>
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="nationalCode">
              کد ملی
            </Label>
            <Controller
              name="nationalCode"
              id="nationalCode"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.nationalCode?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="birthDay">
              تاریخ تولد
            </Label>
            <Controller
              name="birthDay"
              id="birthDay"
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.birthDay?.message}
            </p>
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="insertDate">
              تاریخ ایجاد حساب کاربری
            </Label>
            <Controller
              name="insertDate"
              id="insertDate"
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.insertDate?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="userAbout">
              درباره کاربر
            </Label>
            <Controller
              name="userAbout"
              id="userAbout"
              control={control}
              render={({ field }) => <Input type="textarea" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.userAbout?.message}
            </p>
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="homeAdderess">
              آدرس
            </Label>
            <Controller
              name="homeAdderess"
              id="homeAdderess"
              control={control}
              render={({ field }) => <Input type="textarea" {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.homeAdderess?.message}
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

export default EditUserInfos;
