import { Card, CardBody, Button, Badge } from "reactstrap";
import { showApplyChangesSwal } from "../../../utility/Utils";
import { Users, MessageSquare } from "react-feather";
import "@styles/react/libs/react-select/_react-select.scss";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateOrDeactiveCourse,
  getCourseByIdAdmin,
} from "../../../services/api/Courses";
import toast from "react-hot-toast";

const CourseInfoCard = () => {
  const { courseId } = useParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => getCourseByIdAdmin(courseId),
  });

  const renderCourseImg = (course) => {
    if (course.data.imageAddress) {
      return (
        <img
          height="120"
          width="160"
          alt="course-image"
          src={course.data.imageAddress}
          className="rounded mt-3 mb-2"
        />
      );
    } else {
      return (
        <img
          height="120"
          width="160"
          alt="course-image"
          src="/src/assets/images/notFound/1047293-صفحه-یافت-نشد-خطای-404.jpg"
          className="rounded mt-3 mb-2"
        />
      );
    }
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: activateOrDeactiveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries("courseDetails");
    },
    onError: () => {
      toast.error("error");
    },
  });

  if (isLoading) {
    return <span>loading data ....</span>
  }

  if (error) {
    return <span>خطا در دریافت اطلاعات</span>
  }

  return (
    <Card>
      <CardBody>
        <div className="user-avatar-section">
          <div className="d-flex align-items-center flex-column">
            {renderCourseImg(data)}
            <div className="d-flex flex-column align-items-center text-center">
              <div className="user-info">
                <h4>
                  {data.data !== null ? data.data.title : "Eleanor Aguilar"}
                </h4>
                {data?.data.isActive ? (
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
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-around my-2 pt-75">
          <div className="d-flex align-items-start me-2">
            <Badge color="light-primary" className="rounded p-75">
              <Users className="font-medium-2" />
            </Badge>
            <div className="ms-75">
              <h4 className="mb-0">{data.data.courseUserTotal}</h4>
              <small>دانشجو</small>
            </div>
          </div>
          <div className="d-flex align-items-start">
            <Badge color="light-primary" className="rounded p-75">
              <MessageSquare className="font-medium-2" />
            </Badge>
            <div className="ms-75">
              <h4 className="mb-0">{data.data.courseCommentTotal}</h4>
              <small>کامنت</small>
            </div>
          </div>
        </div>
        <h4 className="fw-bolder border-bottom pb-50 mb-1">جزئیات دوره</h4>
        <div className="info-container">
          {data.data !== null ? (
            <ul className="list-unstyled">
              <li className="mb-75">
                <span className="fw-bolder me-25">نام استاد دوره :</span>
                <span>{data.data.teacherName}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">نام کلاس :</span>
                <span>{data.data.courseClassRoomName}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">سطح دوره :</span>
                <span className="text-capitalize">
                  {data.data.courseLevelName}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">نوع دوره :</span>
                <span className="text-capitalize">
                  {data.data.courseTypeName}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">قیمت دوره :</span>
                <span>{data.data.cost.toLocaleString()} تومان</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">شروع دوره :</span>
                <span>{data.data.startTime.slice(0, 10)}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">پایان دوره :</span>
                <span>{data.data.endTime.slice(0, 10)}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">توضیحات دوره :</span>
                <div
                  dangerouslySetInnerHTML={{ __html: data.data.describe }}
                ></div>
              </li>
            </ul>
          ) : null}
        </div>
        <div className="d-flex justify-content-center pt-2">
          <Button color="primary">ویرایش</Button>
          {data.data.isActive ? (
            <Button
              className="ms-1"
              color="danger"
              outline
              onClick={() => {
                showApplyChangesSwal(() =>
                  mutateAsync({ active: false, id: courseId })
                );
              }}
            >
              غیر فعال کردن
            </Button>
          ) : (
            <Button
              className="ms-1"
              color="success"
              outline
              onClick={() => {
                showApplyChangesSwal(() =>
                  mutateAsync({ active: true, id: courseId })
                );
              }}
            >
              فعال کردن
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CourseInfoCard;
