import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Book, BookOpen } from "react-feather";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useParams } from "react-router-dom";
import {
  addUserAccess,
  deleteUser,
  getUserById,
  recoverDeletedUser,
} from "../../../services/api/Users";
import { useState } from "react";
import toast from "react-hot-toast";

function UserInfoCard({ toggleTab }) {
  const { userId } = useParams();
  const [accessModal, setAccessModal] = useState(false);
  const queryClient = useQueryClient();

  const roles = [
    "Administrator",
    "Teacher",
    "Employee.Admin",
    "Employee.Writer",
    "Student",
    "CourseAssistance",
    "TournamentAdmin",
    "Referee",
    "TournamentMentor",
    "Support",
  ];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserById(userId),
  });

  const { mutateAsync: deleteUserMutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries("userDetails");
      toast.success("تغییرات اعمال شد");
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  const { mutateAsync: recoverDeletedUserMutate } = useMutation({
    mutationFn: recoverDeletedUser,
    onSuccess: () => {
      queryClient.invalidateQueries("userDetails");
      toast.success("تغییرات اعمال شد");
    },
    onError: (err) => toast.error(err.response.data.ErrorMessage[0]),
  });

  if (isLoading) {
    return <p>loading data ...</p>;
  }

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>;
  }

  return (
    <>
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
          <div className="d-flex justify-content-center gap-1 pt-2">
            <Button color="primary" onClick={() => toggleTab("6")}>
              ویرایش
            </Button>
            <Button
              color="primary"
              onClick={() => setAccessModal(!accessModal)}
            >
              دسترسی ها
            </Button>
            {data.data.active ? (
              <Button
                color="danger"
                outline
                onClick={() => deleteUserMutate(userId)}
              >
                غیر فعال کردن
              </Button>
            ) : (
              <Button
                className="ms-1"
                color="success"
                outline
                onClick={() => {
                  const obj = { userId };
                  recoverDeletedUserMutate(obj);
                }}
              >
                فعال کردن
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={accessModal}
        toggle={() => setAccessModal(!accessModal)}
        className="modal-dialog-centered modal-xs"
      >
        <ModalHeader toggle={() => setAccessModal(!accessModal)}>
          دسترسی های کاربر
        </ModalHeader>
        <ModalBody>
          <Row className="flex-column">
            {roles.map((item, index) => (
              <Col className="mb-1">
                <div className="form-check form-check-inline">
                  <Input
                    id={item}
                    type="checkbox"
                    defaultChecked={Array.from(
                      data.data.roles.map((item) => item.roleName)
                    ).includes(item)}
                    onChange={(e) =>
                      addUserAccess(index + 1, userId, e.target.checked).then(
                        () => refetch()
                      )
                    }
                  />
                  <Label for="basic-cb-checked" className="form-check-label">
                    {item}
                  </Label>
                </div>
              </Col>
            ))}
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
}

export default UserInfoCard;
