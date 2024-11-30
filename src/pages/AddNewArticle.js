import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import ArticleDetails from "../components/AddNewArticle/steps-with-validation/ArticleDetails";
import Describe from "../components/AddNewArticle/steps-with-validation/Describe";
import ArticleImage from "../components/AddNewArticle/steps-with-validation/ArticleImage";

function AddNewArticle() {
  const ref = useRef(null);
  const formData = new FormData();
  const [stepper, setStepper] = useState(null);

  const steps = [
    {
      id: "ArticleDetails",
      title: "جزئیات مقاله",
      content: <ArticleDetails stepper={stepper} formData={formData} />,
    },
    {
      id: "ArticleDescribe",
      title: "توضیحات اصلی",
      content: <Describe stepper={stepper} formData={formData} />,
    },
    {
      id: "ArticleImage",
      title: "تصویر مقاله",
      content: <ArticleImage stepper={stepper} formData={formData} />,
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
}

export default AddNewArticle;
