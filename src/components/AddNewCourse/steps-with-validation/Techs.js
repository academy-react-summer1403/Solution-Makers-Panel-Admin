import { ArrowLeft } from "react-feather";
import { useForm, Controller } from "react-hook-form";
import { Button, Col, Form, Row } from "reactstrap";
import Select from "react-select";
import instance from "../../../services/middleware";
import { useMutation, useQuery } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getCreateCourse } from "../../../services/api/Courses";

const schema = yup.object({
  Techs: yup.array().min(1, "حداقل یک تکنولوژی را انتخاب کنید"),
});

function Techs({ stepper, courseId }) {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Techs: [],
    },
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const addCourseTechnology = (techs) =>
    instance.post(`/Course/AddCourseTechnology?courseId=${courseId}`, techs);

  const { data, isLoading, error } = useQuery({
    queryKey: ["getCreateCourse"],
    queryFn: getCreateCourse,
  });

  const { mutateAsync } = useMutation({
    mutationFn: addCourseTechnology,
    onSuccess: () => toast.success("دوره با موفقیت ساخته شد"),
  });

  if (isLoading) {
    return <span>loading data ...</span>;
  }

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">تکنولوژی های دوره را انتخاب کنید</h5>
      </div>
      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          const techs = data.Techs.map((item) => ({ techId: item.value }));
          mutateAsync(techs).then(() => navigate(`/courses/view/${courseId}`));
        })}
      >
        <Row>
          <Col md={6}>
            <Controller
              name="Techs"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  isOptionDisabled={() => getValues("Techs").length == 2}
                  options={data.data.technologyDtos.map((tech) => ({
                    value: tech.id,
                    label: tech.techName.substr(1),
                  }))}
                  {...field}
                />
              )}
            />
            <p style={{ color: "red", marginTop: 5 }}>
              {errors.Techs?.message}
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
            ایجاد دوره
          </Button>
        </div>
      </Form>
    </>
  );
}

export default Techs;
