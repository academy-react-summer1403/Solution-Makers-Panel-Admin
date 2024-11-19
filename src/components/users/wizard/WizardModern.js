import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import EditUserInfos from "./steps-with-validation/EditUserInfos";
import EditUserConnections from "./steps-with-validation/EditUserConnections";

function EditUserFormWizard() {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const [userData, setUserData] = useState({});

  const steps = [
    {
      id: "EditUserInfos",
      title: "اطلاعات کاربر",
      content: <EditUserInfos stepper={stepper} setUserData={setUserData} />,
    },
    {
      id: "EditUserConnections",
      title: "راه های ارتباطی",
      content: (
        <EditUserConnections
          stepper={stepper}
          userData={userData}
          setUserData={setUserData}
        />
      ),
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
}

export default EditUserFormWizard;
