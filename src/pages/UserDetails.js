import { useState } from "react";
import { Col, Row } from "reactstrap";
import UserInfoCard from "../components/users/view/UserInfoCard";
import UserDetailsTabs from "../components/users/view/Tabs";
import "@styles/react/apps/app-users.scss";

function UserDetails() {
  const [active, setActive] = useState("1");

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <div className="app-user-view">
      <Row>
        <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard />
        </Col>
        <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserDetailsTabs active={active} toggleTab={toggleTab} />
        </Col>
      </Row>
    </div>
  );
}

export default UserDetails;
