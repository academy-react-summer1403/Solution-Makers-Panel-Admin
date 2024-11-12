import { ArrowLeft, ArrowRight, UploadCloud } from "react-feather";
import { Row, Col, Button, Form, Input, Label } from "reactstrap";
import instance from "../../../services/middleware";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CourseImage = ({ stepper, formData, setCourseId }) => {
  const addCourse = (formData) => instance.post("/Course", formData);

  const { mutateAsync } = useMutation({
    mutationFn: addCourse,
    onSuccess: (res) => {
      setCourseId(res.data.id);
      toast.success("دوره ساخته شد حالا براش یک یا دو تکنولوژی انتخاب کن");
    },
    onError: (err) => {
      err.response.data.ErrorMessage.map((message) => toast.error(message));
    },
  });

  return (
    <>
      <div className="content-header">
        <h5 className="mb-0">انتخاب تصویر</h5>
      </div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          mutateAsync(formData).then(() => stepper.next());
        }}
      >
        <Row>
          <Col className="mb-1 d-flex flex-column gap-2 rounded-4 overflow-hidden">
            <img className="w-100 h-100" />
            <Label className="w-100 fs-1 cursor-pointer" for="image">
              <div className="d-flex flex-column">
                <span className="text-center">
                  <UploadCloud size={40} />
                </span>
                <p className="text-center">
                  برای انتخاب تصویر دوره اینجا کلیک کنید
                </p>
              </div>
            </Label>
            <Input
              className="d-none"
              type="file"
              id="image"
              onChange={(e) => formData.append("Image", e.target.files[0])}
            />
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
};

export default CourseImage;
