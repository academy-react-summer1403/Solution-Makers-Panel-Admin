import Select from "react-select";
import { ArrowLeft, ArrowRight } from "react-feather";
import { selectThemeColors } from "@utils";
import { Label, Row, Col, Form, Button } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import { useQuery } from "@tanstack/react-query";
import instance from "../../../../services/middleware";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  Trem: yup
    .object()
    .shape({
      label: yup.string().required("status is required (from label)"),
      value: yup.string().required("لطفا ترم دوره را انتخاب کنید"),
    })
    .nullable()
    .required("لطفا ترم دوره را انتخاب کنید"),
});

const EditCourseSpecs = ({ stepper, type, formData }) => {
  const { courseId } = useParams();

  const getCreateCourse = () => instance.get("/Course/GetCreate");

  const getCourseByIdAdmin = (courseId) => instance.get(`/Course/${courseId}`);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      CourseType: {},
      CourseLvl: {},
      Class: {},
      Teacher: {},
      Trem: { value: "", label: "لطفا انتخاب کنید" },
    },
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["getCreateCourse"],
    queryFn: getCreateCourse,
  });

  const { data: courseDetails } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => getCourseByIdAdmin(courseId),
  });

  useEffect(() => {
    if (courseDetails?.data && data?.data) {
      setValue(
        "CourseType",
        data.data.courseTypeDtos
          .map((item) => ({ value: item.id, label: item.typeName }))
          .find((item) => item.label == courseDetails.data.courseTypeName)
      );
      setValue(
        "CourseLvl",
        data.data.courseLevelDtos
          .map((item) => ({
            value: item.id,
            label: item.levelName,
          }))
          .find((item) => item.label == courseDetails.data.courseLevelName)
      );
      setValue(
        "Class",
        data.data.classRoomDtos
          .map((item) => ({
            value: item.id,
            label: item.classRoomName,
          }))
          .find((item) => item.label == courseDetails.data.courseClassRoomName)
      );
      setValue("Teacher", {
        value: courseDetails.data.teacherId,
        label: courseDetails.data.teacherName,
      });
    }
  }, [courseDetails, data]);

  if (isLoading) {
    return <span>loading data ...</span>;
  }

  if (data && courseDetails) {
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
              <Label className="form-label" for={`country-${type}`}>
                نحوه برگزاری
              </Label>
              <Controller
                name="CourseType"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    isClearable={false}
                    id={`country-${type}`}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.courseTypeDtos.map((item) => ({
                      value: item.id,
                      label: item.typeName,
                    }))}
                  />
                )}
              />
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for={`language-${type}`}>
                سطح دوره
              </Label>
              <Controller
                name="CourseLvl"
                control={control}
                render={({ field }) => (
                  <Select
                    // isMulti
                    {...field}
                    isClearable={false}
                    theme={selectThemeColors}
                    id={`language-${type}`}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.courseLevelDtos.map((item) => ({
                      value: item.id,
                      label: item.levelName,
                    }))}
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for={`country-${type}`}>
                نام کلاس
              </Label>

              <Controller
                name="Class"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    isClearable={false}
                    id={`country-${type}`}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.classRoomDtos.map((item) => ({
                      value: item.id,
                      label: item.classRoomName,
                    }))}
                  />
                )}
              />
            </Col>

            <Col md="6" className="mb-1">
              <Label className="form-label" for={`language-${type}`}>
                مدرس دوره
              </Label>
              <Controller
                name="Teacher"
                control={control}
                render={({ field }) => (
                  <Select
                    // isMulti
                    {...field}
                    isClearable={false}
                    theme={selectThemeColors}
                    id={`language-${type}`}
                    className="react-select"
                    classNamePrefix="select"
                    options={data.data.teachers.map((item) => ({
                      value: item.teacherId,
                      label: item.fullName,
                    }))}
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-1">
              <Label className="form-label" for={`country-${type}`}>
                ترم دوره
              </Label>
              <Controller
                name="Trem"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    theme={selectThemeColors}
                    isClearable={false}
                    id={`country-${type}`}
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
                <p>
                  {errors.Trem?.value.message || errors.Trem?.label.message}
                </p>
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
                Previous
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
                Next
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
  }
};

export default EditCourseSpecs;
