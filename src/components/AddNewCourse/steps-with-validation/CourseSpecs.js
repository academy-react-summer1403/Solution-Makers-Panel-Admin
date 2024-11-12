import Select from "react-select";
import { ArrowLeft, ArrowRight } from "react-feather";
import { selectThemeColors } from "@utils";
import { Label, Row, Col, Form, Button } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import { useQuery } from "@tanstack/react-query";
import instance from "../../../services/middleware";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  Trem: yup
    .object()
    .shape({
      value: yup.string().required("لطفا ترم دوره را انتخاب کنید"),
    })
    .nullable(),
  CourseType: yup
    .object()
    .shape({
      value: yup.string().required("لطفا نحوه برگزاری دوره را انتخاب کنید"),
    })
    .nullable(),
  CourseLvl: yup
    .object()
    .shape({
      value: yup.string().required("لطفا سطح دوره را انتخاب کنید"),
    })
    .nullable(),
  Class: yup
    .object()
    .shape({
      value: yup.string().required("لطفا کلاس دوره را انتخاب کنید"),
    })
    .nullable(),
  Teacher: yup
    .object()
    .shape({
      value: yup.string().required("لطفا مدرس دوره را انتخاب کنید"),
    })
    .nullable(),
});

const CourseSpecs = ({ stepper, formData }) => {
  const getCreateCourse = () => instance.get("/Course/GetCreate");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      CourseType: { value: "", label: "لطفا انتخاب کنید" },
      CourseLvl: { value: "", label: "لطفا انتخاب کنید" },
      Class: { value: "", label: "لطفا انتخاب کنید" },
      Teacher: { value: "", label: "لطفا انتخاب کنید" },
      Trem: { value: "", label: "لطفا انتخاب کنید" },
    },
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["getCreateCourse"],
    queryFn: getCreateCourse,
  });

  if (isLoading) {
    return <span>loading data ...</span>;
  }

  if (data)
    return (
      <>
        <div className="content-header">
          <h5 className="mb-0">ویژگی های دوره را وارد کنید</h5>
        </div>
        <Form
          onSubmit={handleSubmit((data, event) => {
            event.preventDefault();
            formData.append("CourseTypeId", data.CourseType.value);
            formData.append("CourseLvlId", data.CourseLvl.value);
            formData.append("ClassId", data.Class.value);
            formData.append("TeacherId", data.Teacher.value);
            formData.append("TremId", data.Trem.value);
          })}
        >
          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="CourseType">
                نحوه برگزاری
              </Label>
              <Controller
                name="CourseType"
                id="CourseType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.courseTypeDtos.map((item) => ({
                      value: item.id,
                      label: item.typeName,
                    }))}
                  />
                )}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.CourseType?.value.message}
              </p>
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for="CourseLvl">
                سطح دوره
              </Label>
              <Controller
                name="CourseLvl"
                id="CourseLvl"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.courseLevelDtos.map((item) => ({
                      value: item.id,
                      label: item.levelName,
                    }))}
                  />
                )}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.CourseLvl?.value.message}
              </p>
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="Class">
                نام کلاس
              </Label>
              <Controller
                name="Class"
                id="Class"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.classRoomDtos.map((item) => ({
                      value: item.id,
                      label: item.classRoomName,
                    }))}
                  />
                )}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.Class?.value.message}
              </p>
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for="Teacher">
                مدرس دوره
              </Label>
              <Controller
                name="Teacher"
                id="Teacher"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable={false}
                    theme={selectThemeColors}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.teachers.map((item) => ({
                      value: item.teacherId,
                      label: item.fullName,
                    }))}
                  />
                )}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                {errors.Teacher?.value.message}
              </p>
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for="Trem">
                ترم دوره
              </Label>
              <Controller
                name="Trem"
                id="Trem"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.termDtos.map((item) => ({
                      value: item.id,
                      label: item.termName,
                    }))}
                  />
                )}
              />
              <p style={{ color: "red", marginTop: 5 }}>
                <p>{errors.Trem?.value.message}</p>
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
              <span className="align-middle d-sm-inline-block d-none">
                ادامه
              </span>
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

export default CourseSpecs;
