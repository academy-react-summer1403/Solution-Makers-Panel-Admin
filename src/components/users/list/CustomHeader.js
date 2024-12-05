import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { Check, X } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createUser } from "../../../services/api/Users";

const schema = yup
  .object({
    firstName: yup.string().required("این فیلد الزامیست").min(2, "حداقل 2 حرف"),
    lastName: yup.string().required("این فیلد الزامیست").min(2, "حداقل 2 حرف"),
    gmail: yup
      .string()
      .required("این فیلد الزامیست")
      .matches(
        /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/g,
        { message: "لطفا یک ایمیل معتبر وارد نمایید" }
      ),
    password: yup.string().required("این فیلد الزامیست").min(6, "حداقل 6 حرف"),
    phoneNumber: yup
      .string()
      .required("این فیلد الزامیست")
      .matches(/((0?9)|(\+?989))\d{9}/g, {
        message: "لطفا یک شماره معتبر وارد نمایید",
      }),
  })
  .required();

function UsersCustomHeader({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  refetch,
  needAddNewUser,
  editObj,
  setEditObj,
  setEditStep,
}) {
  const [show, setShow] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      gmail: "",
      password: "",
      phoneNumber: "",
      isStudent: false,
      isTeacher: false,
    },
    resolver: yupResolver(schema),
  });

  const { mutateAsync: createUserMutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => toast.success("کاربر اضافه شد"),
    onError: (err) =>
      err.response.data.ErrorMessage.map((message) => toast.error(message)),
  });

  return (
    <>
      <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
        <Row className="justify-content-end align-items-center">
          <Col className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1">
            <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
              <Input
                id="search-invoice"
                className="ms-50 w-100"
                type="text"
                placeholder="جستجو ...."
                value={searchTerm}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchTerm(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.key == "Enter") {
                    refetch();
                  }
                }}
              />
            </div>
            {needAddNewUser && (
              <div className="d-flex align-items-center table-header-actions">
                <Button
                  className="add-new-user"
                  color="primary"
                  onClick={() => setShow(true)}
                >
                  افزودن کاربر جدید
                </Button>
              </div>
            )}
            {editObj && (
              <div className="d-flex align-items-center table-header-actions">
                <Button
                  className="add-new-user"
                  color="primary"
                  onClick={() => setEditStep(2)}
                >
                  ادامه
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </div>

      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <p>لطفا اطلاعات کاربر را وارد نمایید</p>
          <Row
            tag="form"
            className="gy-1 pt-75"
            onSubmit={handleSubmit((data, event) => {
              event.preventDefault();
              createUserMutate(data).then(() => reset());
            })}
          >
            <Col xs={12}>
              <Label className="form-label" for="firstName">
                نام
              </Label>
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => {
                  return <Input {...field} id="firstName" />;
                }}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.firstName?.message}
              </p>
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="lastName">
                نام خانوادگی
              </Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => <Input {...field} id="lastName" />}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.lastName?.message}
              </p>
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="gmail">
                ایمیل
              </Label>
              <Controller
                name="gmail"
                control={control}
                render={({ field }) => <Input {...field} id="gmail" />}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.gmail?.message}
              </p>
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="password">
                رمز عبور
              </Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => <Input {...field} id="password" />}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.password?.message}
              </p>
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="phoneNumber">
                شماره همراه
              </Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => <Input {...field} id="phoneNumber" />}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.phoneNumber?.message}
              </p>
            </Col>

            <Col xs={12}>
              <Label className="form-label">تعیین نقش کاربر</Label>
              <div className="d-flex gap-1 mt-1">
                <div className="d-flex align-items-center">
                  <div className="form-switch">
                    <Controller
                      name="isStudent"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="switch"
                          defaultChecked={getValues("isStudent")}
                          id="isStudent"
                          {...field}
                        />
                      )}
                    />
                    <Label className="form-check-label" htmlFor="isStudent">
                      <span className="switch-icon-left">
                        <Check size={14} />
                      </span>
                      <span className="switch-icon-right">
                        <X size={14} />
                      </span>
                    </Label>
                  </div>
                  <Label
                    className="form-check-label fw-bolder"
                    htmlFor="isStudent"
                  >
                    دانشجو
                  </Label>
                </div>

                <div className="d-flex align-items-center">
                  <div className="form-switch">
                    <Controller
                      name="isTeacher"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="switch"
                          defaultChecked={getValues("isTeacher")}
                          id="isTeacher"
                          {...field}
                        />
                      )}
                    />
                    <Label className="form-check-label" htmlFor="isTeacher">
                      <span className="switch-icon-left">
                        <Check size={14} />
                      </span>
                      <span className="switch-icon-right">
                        <X size={14} />
                      </span>
                    </Label>
                  </div>
                  <Label
                    className="form-check-label fw-bolder"
                    htmlFor="isTeacher"
                  >
                    استاد
                  </Label>
                </div>
              </div>
            </Col>
            <Col xs={12} className="text-center mt-2 pt-50">
              <Button type="submit" className="me-1" color="primary">
                ثبت اطلاعات
              </Button>
              <Button
                type="reset"
                color="danger"
                outline
                onClick={() => setShow(false)}
              >
                انصراف
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
}

export default UsersCustomHeader;
