import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import CourseImage from "../components/AddNewCourse/steps-with-validation/CourseImage";
import CourseSpecs from "../components/AddNewCourse/steps-with-validation/CourseSpecs";
import CourseDetails from "../components/AddNewCourse/steps-with-validation/CourseDetails";
import Describe from "../components/AddNewCourse/steps-with-validation/Describe";
import Techs from "../components/AddNewCourse/steps-with-validation/Techs";

const AddNewCourse = () => {

  const ref = useRef(null);
  const formData = new FormData();
  const [stepper, setStepper] = useState(null);
  const [courseId, setCourseId] = useState("");

  const steps = [ 
    {
      id: "CourseDetails",
      title: "جزئیات دوره",
      content: <CourseDetails stepper={stepper} formData={formData} />,
    },
    {
      id: "describe",
      title: "توضیحات اصلی",
      content: <Describe stepper={stepper} formData={formData} />,
    },
    {
      id: "CourseSpecs",
      title: "ویژگی های دوره",
      content: <CourseSpecs stepper={stepper} formData={formData} />,
    },
    {
      id: "CourseImage",
      title: "تصویر دوره",
      content: <CourseImage stepper={stepper} formData={formData} setCourseId={setCourseId}/>,
    },
    {
      id: "techs",
      title: "افزودن تکنولوژی",
      content: <Techs stepper={stepper} courseId={courseId}/>,
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
};

export default AddNewCourse;
