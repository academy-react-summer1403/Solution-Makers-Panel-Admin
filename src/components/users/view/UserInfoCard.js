import { useQuery } from "@tanstack/react-query";
import { Book, BookOpen } from "react-feather";
import { Badge, Button, Card, CardBody } from "reactstrap";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../services/api/Users";

function UserInfoCard({ toggleTab }) {
  const { userId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(userId),
  });

  if (isLoading) {
    return <p>loading data ...</p>;
  }

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>
  }

  return (
    <Card>
      <CardBody>
        <div className="user-avatar-section">
          <div className="d-flex align-items-center flex-column">
            <img
              height="120"
              width="160"
              alt="course-image"
              src={
                data.data.currentPictureAddress == "Not-set"
                  ? "/src/assets/images/notFound/images.png"
                  : data.data.currentPictureAddress
              }
              className="rounded mt-3 mb-2"
            />
            <div className="d-flex flex-column align-items-center text-center">
              <div className="user-info">
                <h4>
                  {data.data.fName ? data.data.fName : "کاربر"}{" "}
                  {data.data.lName ? data.data.lName : "سایت"}
                </h4>
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-1">
                  {data.data.roles.map((role) => (
                    <span
                      style={{
                        display: "inline-flex",
                        marginTop: "10px",
                        padding: "5px 12px 5px 12px",
                        backgroundColor: "#cafade",
                        color: "#28c76f",
                      }}
                      className="text-capitalize rounded-2"
                    >
                      {role.roleName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around my-2 pt-75">
          <div className="d-flex align-items-start me-2">
            <Badge color="light-primary" className="rounded p-75">
              <BookOpen className="font-medium-2" />
            </Badge>
            <div className="ms-75">
              <h4 className="mb-0">{data.data.courses.length}</h4>
              <small>دوره</small>
            </div>
          </div>
          <div className="d-flex align-items-start">
            <Badge color="light-primary" className="rounded p-75">
              <Book className="font-medium-2" />
            </Badge>
            <div className="ms-75">
              <h4 className="mb-0">{data.data.coursesReseves.length}</h4>
              <small>دوره رزرو شده</small>
            </div>
          </div>
        </div>
        <h4 className="fw-bolder border-bottom pb-50 mb-1">جزئیات</h4>
        <div className="info-container">
          {data.data !== null ? (
            <ul className="list-unstyled">
              <li className="mb-75">
                <span className="fw-bolder me-25">نام کاربری :</span>
                <span>{data.data.userName}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">کد ملی :</span>
                <span>{data.data.nationalCode}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">شماره همراه :</span>
                <span>{data.data.phoneNumber}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">ایمیل :</span>
                <span>{data.data.gmail}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">درصد تکمیل پروفایل :</span>
                <span className="text-capitalize">
                  %{data.data.profileCompletionPercentage}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">وضعیت :</span>
                <span className="text-capitalize">
                  {data.data.active ? (
                    <span
                      style={{
                        display: "inline-flex",
                        marginTop: "10px",
                        padding: "5px 12px 5px 12px",
                        backgroundColor: "#cafade",
                        color: "#28c76f",
                      }}
                      className="text-capitalize rounded-2"
                    >
                      فعال
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-flex",
                        marginTop: "10px",
                        padding: "5px 12px 5px 12px",
                        backgroundColor: "#ffdbdb",
                        color: "#ff0000",
                      }}
                      className="text-capitalize rounded-2"
                    >
                      غیر فعال
                    </span>
                  )}
                </span>
              </li>
            </ul>
          ) : null}
        </div>
        <div className="d-flex justify-content-center pt-2">
          <Button color="primary" onClick={() => toggleTab("6")}>
            ویرایش
          </Button>
          {data.data.active ? (
            <Button
              className="ms-1"
              color="danger"
              outline
              //   onClick={() => {
              //     showApplyChangesSwal(() =>
              //       mutateAsync({ active: false, id: courseId })
              //     );
              //   }}
            >
              غیر فعال کردن
            </Button>
          ) : (
            <Button
              className="ms-1"
              color="success"
              outline
              //   onClick={() => {
              //     showApplyChangesSwal(() =>
              //       mutateAsync({ active: true, id: courseId })
              //     );
              //   }}
            >
              فعال کردن
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default UserInfoCard;
