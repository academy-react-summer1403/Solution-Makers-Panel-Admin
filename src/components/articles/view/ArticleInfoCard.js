import { Card, CardBody, Button, Badge, Spinner } from "reactstrap";
import { showApplyChangesSwal } from "../../../utility/Utils";
import { MessageSquare, Eye } from "react-feather";
import "@styles/react/libs/react-select/_react-select.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  activeOrDeactiveNews,
  getArticleById,
} from "../../../services/api/Articles";
import ErrorComponent from "../../common/ErrorComponent";

const ArticleInfoCard = ({ toggleTab }) => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["articleDetails", articleId],
    queryFn: () => getArticleById(articleId),
  });

  const renderCourseImg = (article) => {
    if (article.data.detailsNewsDto.currentImageAddress) {
      return (
        <img
          height="120"
          width="160"
          alt="course-image"
          src={article.data.detailsNewsDto.currentImageAddress}
          className="rounded mt-3 mb-2"
        />
      );
    } else if (article.data.detailsNewsDto.currentImageAddressTumb) {
      return (
        <img
          height="120"
          width="160"
          alt="course-image"
          src={article.data.detailsNewsDto.currentImageAddressTumb}
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

  const { mutateAsync: activeOrDeactiveNewsMutate } = useMutation({
    mutationFn: activeOrDeactiveNews,
    onSuccess: () => {
      toast.success("تغییرات اعمال شد");
      navigate("/articles");
    },
    onError: () => toast.error("خطایی رخ داد"),
  });

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <ErrorComponent />;
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
                  {data.data !== null
                    ? data.data.detailsNewsDto.title
                    : "Eleanor Aguilar"}
                </h4>
                {data.data.detailsNewsDto.active ? (
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
              <Eye className="font-medium-2" />
            </Badge>
            <div className="ms-75">
              <h4 className="mb-0">{data.data.detailsNewsDto.currentView}</h4>
              <small>بازدید</small>
            </div>
          </div>
          <div className="d-flex align-items-start">
            <Badge color="light-primary" className="rounded p-75">
              <MessageSquare className="font-medium-2" />
            </Badge>
            <div className="ms-75">
              <h4 className="mb-0">{data.data.commentDtos.length}</h4>
              <small>کامنت</small>
            </div>
          </div>
        </div>
        <h4 className="fw-bolder border-bottom pb-50 mb-1">جزئیات دوره</h4>
        <div className="info-container">
          {data.data !== null ? (
            <ul className="list-unstyled">
              <li className="mb-75">
                <span className="fw-bolder me-25">نام نویسنده : </span>
                <Link to={`/users/view/${data.data.detailsNewsDto.userId}`}>
                  <span>{data.data.detailsNewsDto.addUserFullName}</span>
                </Link>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">دسته بندی : </span>
                <span>{data.data.detailsNewsDto.newsCatregoryName}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">عنوان گوگل : </span>
                <span className="text-capitalize">
                  {data.data.detailsNewsDto.googleTitle}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">توضیحات گوگل : </span>
                <span className="text-capitalize">
                  {data.data.detailsNewsDto.googleDescribe}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">توضیحات کوتاه : </span>
                <span className="text-capitalize">
                  {data.data.detailsNewsDto.miniDescribe}
                </span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">تاریخ ایجاد : </span>
                <span>{data.data.detailsNewsDto.insertDate.slice(0, 10)}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">آخرین بروز رسانی : </span>
                <span>{data.data.detailsNewsDto.updateDate.slice(0, 10)}</span>
              </li>
              {/* <li className="mb-75">
                <span className="fw-bolder me-25">توضیحات دوره :</span>
                <div
                  dangerouslySetInnerHTML={{ __html: data.data.detailsNewsDto.describe }}
                ></div>
              </li> */}
            </ul>
          ) : null}
        </div>
        <div className="d-flex justify-content-center pt-2">
          {/* <Button color="primary" onClick={() => toggleTab("6")}>
            ویرایش
          </Button> */}
          {data.data.detailsNewsDto.active ? (
            <Button
              className="ms-1"
              color="danger"
              outline
              onClick={() => {
                const formData = new FormData();
                formData.append("Id", articleId);
                formData.append("Active", false);
                showApplyChangesSwal(() =>
                  activeOrDeactiveNewsMutate(formData)
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
                const formData = new FormData();
                formData.append("Id", articleId);
                formData.append("Active", true);
                showApplyChangesSwal(() =>
                  activeOrDeactiveNewsMutate(formData)
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

export default ArticleInfoCard;
