import { ArrowLeft, ArrowRight } from "react-feather";
import { Button, Col, Form, Row } from "reactstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextEditor from "../../Editor";

const schema = yup
  .object({
    Describe: yup
      .string()
      .required("توضیحات کامل مقاله را وارد کنید")
      .min(50, "حداقل 50 حرف"),
  })
  .required();

function Describe({ stepper, formData }) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Describe: "",
    },
  });

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">توضیحات مقاله را وارد کنید</h5>
      </div>
      <Form
        onSubmit={handleSubmit((data, event) => {
          event.preventDefault();
          formData.append("Describe", data.Describe);
        })}
      >
        <Row>
          <Col>
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
            type="submit"
            color="primary"
            className="btn-next"
            onClick={() => {
              if (getValues("Describe").length >= 20) {
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
}

export default Describe;
