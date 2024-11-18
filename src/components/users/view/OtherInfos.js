import { useParams } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import instance from "../../../services/middleware";

function UserOtherInfos() {
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
    <>
      <Card>
        <CardBody>
          <CardTitle className="mb-75">سایر اطلاعات کاربر</CardTitle>
          <div className="info-container">
            <ul className="list-unstyled">
              <li className="mb-75">
                <span className="fw-bolder me-25">آی دی کاربر :</span>
                <span>{data.data.id}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">درباره کاربر :</span>
                <span>{data.data.userAbout}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">آدرس محل سکونت :</span>
                <span>{data.data.homeAdderess}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">تاریخ تولد :</span>
                <span>{data.data.birthDay.slice(0, 10)}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">
                  تاریخ ایجاد حساب کاربری :
                </span>
                <span className="text-capitalize">
                  {data.data.insertDate.slice(0, 10)}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">ایمیل بازیابی :</span>
                <span>{data.data.recoveryEmail}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">
                  اعتبار سنجی دو مرحله ای :
                </span>
                {data.data.twoStepAuth ? (
                  <span>فعال</span>
                ) : (
                  <span>غیر فعال</span>
                )}
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">دریافت پیام رویدادها :</span>
                {data.data.receiveMessageEvent ? (
                  <span>فعال</span>
                ) : (
                  <span>غیر فعال</span>
                )}
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default UserOtherInfos;
