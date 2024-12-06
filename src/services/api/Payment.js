import instance from "../middleware";

export const getCoursePaymentById = (id) =>
  instance.get(`/CoursePayment?CourseId=${id}`);

export const acceptPayment = (formData) =>
  instance.put("/CoursePayment/Accept", formData);

export const deletePayment = (formData) =>
  instance.delete("/CoursePayment", { data: formData });
