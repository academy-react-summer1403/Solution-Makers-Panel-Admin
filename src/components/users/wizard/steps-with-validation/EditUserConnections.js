import { useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "../../../../services/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Label, Row, Col, Input, Form, Button } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "react-feather";
import toast from "react-hot-toast";

const schema = yup.object({
  gmail: yup
    .string()
    .required("ایمیل الزامیست")
    .matches(
      /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/g,
      { message: "لطفا یک ایمیل معتبر وارد نمایید" }
    ),
  recoveryEmail: yup
    .string()
    .required("ایمیل بازیابی الزامیست")
    .matches(
      /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/g,
      { message: "لطفا یک ایمیل معتبر وارد نمایید" }
    ),
  phoneNumber: yup
    .string()
    .required("این فیلد الزامیست")
    .matches(/((0?9)|(\+?989))\d{9}/g, {
      message: "لطفا یک شماره معتبر وارد نمایید",
    }),
  telegramLink: yup
    .string()
    .matches(/(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/, {
      message: "لطفا یک لینک معتبر وارد کنید",
    }),
  linkdinProfile: yup
    .string()
    .matches(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/gm, {
      message: "لطفا یک لینک معتبر وارد کنید",
    }),
});

function EditUserConnections({ stepper, userData }) {
  const { userId } = useParams();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      gmail: "",
      recoveryEmail: "",
      phoneNumber: "",
      telegramLink: "",
      linkdinProfile: "",
    },
    resolver: yupResolver(schema),
  });

  const getUserById = (userId) => instance.get(`/User/UserDetails/${userId}`);

  const updateUser = (obj) => instance.put("/User/UpdateUser", obj);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(userId),
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries("userDetails");
      toast.success("اطلاعات ثبت شد");
    },
    onError: (err) => toast.error("خطایی رخ داد"),
  });

  useEffect(() => {
    if (data?.data) {
      setValue("gmail", data.data.gmail);
      setValue("phoneNumber", data.data.phoneNumber);
      data.data.recoveryEmail &&
        setValue("recoveryEmail", data.data.recoveryEmail);
      data.data.telegramLink &&
        setValue("telegramLink", data.data.telegramLink);
      data.data.linkdinProfile &&
        setValue("linkdinProfile", data.data.linkdinProfile);
    }
  }, [data]);

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">ویرایش راه های ارتباطی</h5>
      </div>
      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          mutateAsync({
            ...userData,
            gmail: data.gmail,
            recoveryEmail: data.recoveryEmail,
            phoneNumber: data.phoneNumber,
            telegramLink: data.telegramLink ? data.telegramLink : "",
            linkdinProfile: data.linkdinProfile ? data.linkdinProfile : "",
          });
        })}
      >
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="gmail">
              ایمیل کاربر
            </Label>
            <Controller
              name="gmail"
              id="gmail"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.gmail?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="recoveryEmail">
              ایمیل بازیابی
            </Label>
            <Controller
              name="recoveryEmail"
              id="recoveryEmail"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.recoveryEmail?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="phoneNumber">
              شماره همراه کاربر
            </Label>
            <Controller
              name="phoneNumber"
              id="phoneNumber"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.phoneNumber?.message}
            </p>
          </Col>

          <Col md="6" className="mb-1">
            <Label className="form-label" for="telegramLink">
              لینک تلگرام
            </Label>
            <Controller
              name="telegramLink"
              id="telegramLink"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.telegramLink?.message}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="linkdinProfile">
              پروفایل لینکدین
            </Label>
            <Controller
              name="linkdinProfile"
              id="linkdinProfile"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.linkdinProfile?.message}
            </p>
          </Col>
        </Row>

        <div className="d-flex justify-content-between">
          <Button
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              بازگشت
            </span>
          </Button>
          <Button type="submit" color="success" className="btn-submit">
            ثبت اطلاعات
          </Button>
        </div>
      </Form>
    </>
  );
}

export default EditUserConnections;
