import { Card, CardBody, CardTitle } from "reactstrap";
import Telegram from "@src/assets/images/logo/Telegram.png";
import Linkedin from "@src/assets/images/logo/Linkedin.png";
import { useParams } from "react-router-dom";
import instance from "../../../services/middleware";
import { useQuery } from "@tanstack/react-query";

function UserConnections() {
  const { userId } = useParams();

  const getUserById = (userId) => instance.get(`/User/UserDetails/${userId}`);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(userId),
  });

  if (isLoading) {
    return <p>loading data ...</p>;
  }

  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-75">شبکه های اجتماعی کاربر</CardTitle>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <img className="me-1" src={Telegram} height="38" width="38" />
          </div>
          <div className="d-flex align-item-center justify-content-between flex-grow-1">
            <div className="me-1">
              <p className="fw-bolder mb-0">لینک تلگرام</p>
              <a href={data.data.telegramLink} target="_blank">
                {data.data.telegramLink}
              </a>
            </div>
          </div>
        </div>
        <div className="d-flex mt-2">
          <div className="flex-shrink-0">
            <img className="me-1" src={Linkedin} height="38" width="38" />
          </div>
          <div className="d-flex align-item-center justify-content-between flex-grow-1">
            <div className="me-1">
              <p className="fw-bolder mb-0">پروفایل لینکدین</p>
              <a href={data.data.linkdinProfile} target="_blank">
                {data.data.linkdinProfile}
              </a>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default UserConnections;
