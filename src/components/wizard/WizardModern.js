import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import EditCourseImage from "./steps-with-validation/EditCourseImage";
import EditCourseSpecs from "./steps-with-validation/EditCourseSpecs";
import EditCourseDetails from "./steps-with-validation/EditCourseDetails";

const WizardHorizontal = () => {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const formData = new FormData();

  const steps = [
    {
      id: "EditCourseDetails",
      title: "جزئیات دوره",
      content: <EditCourseDetails stepper={stepper} formData={formData} />,
    },
    {
      id: "EditCourseSpecs",
      title: "ویژگی های دوره",
      content: <EditCourseSpecs stepper={stepper} formData={formData} />,
    },
    {
      id: "EditCourseImage",
      title: "تصویر دوره",
      content: <EditCourseImage stepper={stepper} formData={formData} />,
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
};

export default WizardHorizontal;
