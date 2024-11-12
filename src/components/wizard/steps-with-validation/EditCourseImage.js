import { ArrowLeft } from "react-feather";
import { Row, Col, Button, Form, Input } from "reactstrap";
import instance from "../../../services/middleware";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditCourseImage = ({ stepper, formData }) => {
  const { courseId } = useParams();

  const getCourseByIdAdmin = (courseId) => instance.get(`/Course/${courseId}`);

  const editCourse = (formData) => instance.put("/Course", formData);

  const queryClient = useQueryClient();

  const { data: courseDetails } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => getCourseByIdAdmin(courseId),
  });

  const { mutateAsync } = useMutation({
    mutationFn: editCourse,
    onSuccess: () => {
      queryClient
        .invalidateQueries(["courseDetails", courseId])
        .then(() => toast.success("ویرایش شد"));
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
          if (!formData.get("Image")) {
            formData.append(
              "TumbImageAddress",
              courseDetails?.data.imageAddress
            );

            mutateAsync(formData);
          } else {
            mutateAsync(formData);
          }
        }}
      >
        <Row>
          <Col
            md="6"
            className="mb-1 d-flex flex-column gap-2 rounded-4 overflow-hidden"
          >
            <img
              className="w-100 h-100"
              src={courseDetails?.data.imageAddress}
            />

            <Input
              type="file"
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
          <Button type="submit" color="success" className="btn-submit">
            ثبت اطلاعات
          </Button>
        </div>
      </Form>
    </>
  );
};

export default EditCourseImage;
