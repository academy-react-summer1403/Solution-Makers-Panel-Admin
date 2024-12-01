import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import * as yup from "yup";

const schema = yup
  .object({
    title: yup
      .string()
      .required("عنوان پاسخ را وارد کنید")
      .min(5, "حداقل 5 حرف")
      .max(40, "حداکثر 40 حرف"),
    body: yup
      .string()
      .required("متن پاسخ را وارد کنید")
      .min(10, "حداقل 10 حرف"),
  })
  .required();

function ReplyModal({
  centeredModal,
  setCenteredModal,
  replyToCourseCommentMutate,
  editCourseCommentMutate
}) {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  return (
    <div className="vertically-centered-modal">
        <Modal
          isOpen={centeredModal}
          toggle={() => setCenteredModal(!centeredModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>
            {getValues("commentId") ? "ویرایش کامنت" : "پاسخ خود را بنویسید"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={handleSubmit((data, event) => {
                event.preventDefault();
                const formData = new FormData();
                if (getValues("commentId")) {
                  formData.append("CommentId", getValues("commentId"));
                  formData.append("CourseId", courseId);
                  formData.append("Title", data.title);
                  formData.append("Describe", data.body);
                  editCourseCommentMutate(formData).then(() => {
                    reset();
                    setCenteredModal(!centeredModal);
                  });
                } else {
                  formData.append("CommentId", commentData.id);
                  formData.append("CourseId", courseId);
                  formData.append("Title", data.title);
                  formData.append("Describe", data.body);
                  replyToCourseCommentMutate(formData).then(() => {
                    reset();
                    setCenteredModal(!centeredModal);
                  });
                }
              })}
            >
              <div className="mb-2">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="عنوان پاسخ" />
                  )}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.title?.message}
                </p>
              </div>
              <div className="mb-2">
                <Controller
                  name="body"
                  control={control}
                  render={({ field }) => (
                    <Input type="textarea" {...field} placeholder="متن پاسخ" />
                  )}
                />
                <p style={{ color: "red", marginTop: 5 }}>
                  {errors.body?.message}
                </p>
              </div>
              <div className="text-end">
                <Button color="primary" type="submit">
                  {getValues("commentId") ? "ثبت" : "ارسال"}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
  );
}

export default ReplyModal;
